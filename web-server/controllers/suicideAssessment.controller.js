const { response } = require('express');
const SuicideAssessment = require('../models/suicideAssessment');
const Student = require('../models/student');

// Constantes para niveles de riesgo
const RISK_LEVELS = {
    LOW: 'Bajo',
    MEDIUM: 'Medio',
    HIGH: 'Alto'
};

const createAssessment = async (req, res = response) => {
    try {
        const { studentId, ...assessmentData } = req.body;

        // Verificar si el estudiante existe
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                ok: false,
                msg: 'Estudiante no encontrado'
            });
        }

        // Crear la evaluación
        const assessment = new SuicideAssessment({
            ...assessmentData,
            student: studentId,
            psychologist: req.uid // ID del psicólogo que realiza la evaluación
        });

        // Calcular el nivel de riesgo
        assessment.riskLevel = assessment.calculateRiskLevel();

        // Guardar en la base de datos
        await assessment.save();

        // Poblar los datos del estudiante y psicólogo
        await assessment.populate('student psychologist');

        res.json({
            ok: true,
            assessment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const getAssessments = async (req, res = response) => {
    try {
        const assessments = await SuicideAssessment.find()
            .populate('student', 'name')
            .populate('psychologist', 'name');

        res.json({
            ok: true,
            assessments
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const getAssessmentById = async (req, res = response) => {
    const id = req.params.id;

    try {
        const assessment = await SuicideAssessment.findById(id)
            .populate('student')
            .populate('psychologist', 'name');

        if (!assessment) {
            return res.status(404).json({
                ok: false,
                msg: 'Evaluación no encontrada'
            });
        }

        res.json({
            ok: true,
            assessment
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const getStatistics = async (req, res = response) => {
    try {
        // Obtener conteo por nivel de riesgo
        const riskLevels = await SuicideAssessment.aggregate([
            {
                $group: {
                    _id: '$riskLevel',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Obtener total de evaluaciones
        const total = await SuicideAssessment.countDocuments();

        return res.json({
            ok: true,
            statistics: {
                total,
                riskLevels
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};


module.exports = {
    createAssessment,
    getAssessments,
    getAssessmentById,
    getStatistics
};