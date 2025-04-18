const { response } = require('express');
const SuicideAssessment = require('../models/suicideAssessment');
const Student = require('../models/student');

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
        const studentId = req.query.studentId;
        let query = {};

        if (studentId) {
            query.student = studentId;
        }

        const assessments = await SuicideAssessment.find(query)
            .populate('student', 'firstName lastName')
            .populate('psychologist', 'firstName lastName')
            .sort({ date: -1 });

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
    try {
        const id = req.params.id;
        const assessment = await SuicideAssessment.findById(id)
            .populate('student', 'firstName lastName')
            .populate('psychologist', 'firstName lastName');

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
        // Estadísticas generales
        const totalAssessments = await SuicideAssessment.countDocuments();
        const riskLevelStats = await SuicideAssessment.aggregate([
            {
                $group: {
                    _id: '$riskLevel',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Tendencias por mes
        const monthlyStats = await SuicideAssessment.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            ok: true,
            statistics: {
                total: totalAssessments,
                riskLevels: riskLevelStats,
                monthly: monthlyStats
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
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
