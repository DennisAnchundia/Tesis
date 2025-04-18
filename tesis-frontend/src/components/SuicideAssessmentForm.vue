`<template>
  <div class="modal-backdrop">
    <div class="modal-window">
      <div class="modal-header">
        <h3>Evaluación de Riesgo Suicida - Escala Columbia</h3>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitAssessment" class="assessment-form">
          <!-- Sección de Ideación Suicida -->
          <div class="assessment-section">
            <h3>Ideación Suicida</h3>
            <p class="validation-message">
              * Primero responda las preguntas 1 y 2. Si ambas son negativas, podrá continuar con la sección de Comportamiento Suicida.
            </p>
          </div>
          <!-- 1. Deseos de morir -->
          <div class="assessment-item">
            <h4>1. Deseos de morir</h4>
            <p class="description">
              El/la participante reconoce tener pensamientos sobre su deseo de morir o dejar de vivir o de quedarse dormido/a y no despertar.
            </p>
            <div class="questions">
              <p>¿Has pensado en estar muerto/a o lo que sería estar muerto/a?</p>
              <p>¿Has deseado estar muerto/a o que pudieras quedarte dormido/a y nunca despertar?</p>
              <p>¿Desearías dejar de vivir?</p>
            </div>
            <div class="response-section">
              <div class="radio-group">
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.deathWish.present" 
                    :value="true"
                    required
                  > Sí
                </label>
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.deathWish.present" 
                    :value="false"
                    required
                  > No
                </label>
              </div>
              <textarea
                v-if="assessment.deathWish.present"
                v-model="assessment.deathWish.description"
                placeholder="Describe la respuesta..."
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- 2. Pensamientos suicidas activos no específicos -->
          <div class="assessment-item">
            <h4>2. Pensamientos suicidas activos no específicos</h4>
            <p class="description">
              Pensamientos generales, no específicos de querer terminar con su vida/suicidarse sin pensamientos sobre las maneras de matarse, métodos relacionados, intenciones o plan.
            </p>
            <div class="questions">
              <p>¿Has pensado en hacer algo para dejar de vivir?</p>
              <p>¿Has pensado en matarte?</p>
            </div>
            <div class="response-section">
              <div class="radio-group">
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.nonSpecificActiveSuicidalThoughts.present" 
                    :value="true"
                    required
                  > Sí
                </label>
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.nonSpecificActiveSuicidalThoughts.present" 
                    :value="false"
                    required
                  > No
                </label>
              </div>
              <textarea
                v-if="assessment.nonSpecificActiveSuicidalThoughts.present"
                v-model="assessment.nonSpecificActiveSuicidalThoughts.description"
                placeholder="Describe la respuesta..."
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- 3. Ideación suicida activa con cualquier método (solo si pregunta 2 es positiva) -->
          <div v-if="showAdditionalIdeation" class="assessment-item">
            <h4>3. Ideación suicida activa con cualquier método (no un plan)</h4>
            <p class="description">
              El/la participante reconoce tener pensamientos suicidas y ha pensado en al menos un método durante el período de evaluación.
            </p>
            <div class="questions">
              <p>¿Has pensado en cómo lo harías o qué harías para dejar de vivir (matarte)?</p>
              <p>¿En qué pensaste?</p>
            </div>
            <div class="response-section">
              <div class="radio-group">
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.activeSuicidalIdeationWithMethods.present" 
                    :value="true"
                    required
                  > Sí
                </label>
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.activeSuicidalIdeationWithMethods.present" 
                    :value="false"
                    required
                  > No
                </label>
              </div>
              <textarea
                v-if="assessment.activeSuicidalIdeationWithMethods.present"
                v-model="assessment.activeSuicidalIdeationWithMethods.description"
                placeholder="Describe la respuesta..."
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- 4. Ideación suicida activa con intención (solo si pregunta 2 es positiva) -->
          <div v-if="showAdditionalIdeation" class="assessment-item">
            <h4>4. Ideación suicida activa con intención</h4>
            <p class="description">
              El/la participante tiene pensamientos suicidas activos e informa tener cierta intención de llevarlos a cabo.
            </p>
            <div class="questions">
              <p>Cuando pensaste hacer algo para dejar de vivir (o matarte), ¿pensaste que esto era algo que realmente podrías hacer?</p>
            </div>
            <div class="response-section">
              <div class="radio-group">
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.activeSuicidalIdeationWithIntent.present" 
                    :value="true"
                    required
                  > Sí
                </label>
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.activeSuicidalIdeationWithIntent.present" 
                    :value="false"
                    required
                  > No
                </label>
              </div>
              <textarea
                v-if="assessment.activeSuicidalIdeationWithIntent.present"
                v-model="assessment.activeSuicidalIdeationWithIntent.description"
                placeholder="Describe la respuesta..."
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- 5. Ideación suicida activa con plan (solo si pregunta 2 es positiva) -->
          <div v-if="showAdditionalIdeation" class="assessment-item">
            <h4>5. Ideación suicida activa con plan</h4>
            <p class="description">
              Pensamientos de suicidio con detalles elaborados completa o parcialmente y el/la participante tiene cierta intención de llevarlos a cabo.
            </p>
            <div class="questions">
              <p>¿Has decidido cómo o cuándo harías algo para dejar de vivir/matarte?</p>
              <p>¿Has planificado (elaboraste los detalles de) cómo lo harías?</p>
              <p>¿Cuál era tu plan?</p>
            </div>
            <div class="response-section">
              <div class="radio-group">
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.activeSuicidalIdeationWithPlan.present" 
                    :value="true"
                    required
                  > Sí
                </label>
                <label>
                  <input 
                    type="radio" 
                    v-model="assessment.activeSuicidalIdeationWithPlan.present" 
                    :value="false"
                    required
                  > No
                </label>
              </div>
              <textarea
                v-if="assessment.activeSuicidalIdeationWithPlan.present"
                v-model="assessment.activeSuicidalIdeationWithPlan.description"
                placeholder="Describe la respuesta..."
                rows="2"
              ></textarea>
            </div>
          </div>

          <!-- Sección de Intensidad de la Ideación (solo si hay ideación) -->
          <div v-if="showIntensitySection" class="assessment-section intensity-section">
            <h3>Intensidad de la Ideación</h3>
            <p class="section-description">
              La siguiente característica debe ser evaluada con respecto al tipo más serio de ideación (p. ej., 1-5 de arriba, con 1 siendo el menos serio y 5 siendo el más serio).
            </p>

            <!-- Tipo de ideación más seria -->
            <div class="assessment-item">
              <h4>Ideación más seria</h4>
              <div class="form-group">
                <div class="select-group">
                  <label>Tipo de ideación (1-5):</label>
                  <select 
                    v-model.number="assessment.ideationIntensity.mostSeriousIdeationType"
                    required
                  >
                    <option value="">Seleccione el tipo</option>
                    <option value="1">1. Deseo de estar muerto/a</option>
                    <option value="2">2. Pensamientos suicidas activos no específicos</option>
                    <option value="3">3. Ideación suicida activa con métodos</option>
                    <option value="4">4. Ideación suicida activa con intención</option>
                    <option value="5">5. Ideación suicida activa con plan</option>
                  </select>
                </div>
                <div class="details-group">
                  <label>Descripción de la ideación:</label>
                  <textarea
                    v-model="assessment.ideationIntensity.mostSeriousIdeationDescription"
                    placeholder="Describa la ideación más seria..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Frecuencia de la ideación -->
            <div class="assessment-item">
              <h4>Frecuencia</h4>
              <p class="description">¿Cuántas veces has tenido estos pensamientos?</p>
              <div class="form-group">
                <div class="radio-group">
                  <label>
                    <input
                      type="radio"
                      v-model.number="assessment.ideationIntensity.frequency"
                      :value="1"
                    >
                    Sólo una vez
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model.number="assessment.ideationIntensity.frequency"
                      :value="2"
                    >
                    Unas pocas veces
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model.number="assessment.ideationIntensity.frequency"
                      :value="3"
                    >
                    Muchas
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model.number="assessment.ideationIntensity.frequency"
                      :value="4"
                    >
                    Todo el tiempo
                  </label>
                  <label>
                    <input
                      type="radio"
                      v-model.number="assessment.ideationIntensity.frequency"
                      :value="0"
                    >
                    No sabe/No corresponde
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Observaciones generales -->
          <div class="assessment-item">
            <h4>Observaciones Generales</h4>
            <textarea
              v-model="assessment.observations"
              placeholder="Ingrese observaciones adicionales..."
              rows="3"
            ></textarea>
          </div>

          <!-- Sección de Comportamiento Suicida (solo visible si las preguntas 1 y 2 son negativas) -->
          <div v-if="canShowBehaviorSection" class="assessment-section behavior-section">
            <h3>Comportamiento Suicida</h3>
            
            <!-- Intento real -->
            <div class="assessment-item">
              <h4>Intento Real</h4>
              <p class="description">
                Un acto potencialmente autolesivo cometido con cierto deseo de morir como resultado.
              </p>
              <div class="questions">
                <p>¿Hiciste algo para tratar de matarte o para dejar de vivir?</p>
                <p>¿Te hiciste daño a propósito?</p>
              </div>
              <div class="response-section">
                <div class="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.actualAttempt.present" 
                      :value="true"
                      required
                    > Sí
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.actualAttempt.present" 
                      :value="false"
                      required
                    > No
                  </label>
                </div>
                <div v-if="assessment.actualAttempt.present" class="additional-info">
                  <textarea
                    v-model="assessment.actualAttempt.description"
                    placeholder="Describe lo que sucedió..."
                    rows="2"
                  ></textarea>
                  <div class="number-input">
                    <label>Número total de intentos:</label>
                    <input 
                      type="number" 
                      v-model.number="assessment.actualAttempt.totalAttempts"
                      min="0"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Autolesión no suicida -->
            <div class="assessment-item">
              <h4>Comportamiento Autolesivo No Suicida</h4>
              <div class="response-section">
                <div class="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.nonSuicidalSelfInjury.present" 
                      :value="true"
                      required
                    > Sí
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.nonSuicidalSelfInjury.present" 
                      :value="false"
                      required
                    > No
                  </label>
                </div>
                <textarea
                  v-if="assessment.nonSuicidalSelfInjury.present"
                  v-model="assessment.nonSuicidalSelfInjury.description"
                  placeholder="Describe el comportamiento..."
                  rows="2"
                ></textarea>
              </div>
            </div>

            <!-- Intento interrumpido -->
            <div class="assessment-item">
              <h4>Intento Interrumpido</h4>
              <p class="description">
                Cuando la persona es interrumpida al empezar un acto potencialmente autolesivo.
              </p>
              <div class="questions">
                <p>¿Ha habido algún momento en que empezaste a hacer algo para dejar de vivir pero alguien o algo te detuvo?</p>
              </div>
              <div class="response-section">
                <div class="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.interruptedAttempt.present" 
                      :value="true"
                      required
                    > Sí
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.interruptedAttempt.present" 
                      :value="false"
                      required
                    > No
                  </label>
                </div>
                <div v-if="assessment.interruptedAttempt.present" class="additional-info">
                  <textarea
                    v-model="assessment.interruptedAttempt.description"
                    placeholder="Describe lo que sucedió..."
                    rows="2"
                  ></textarea>
                  <div class="number-input">
                    <label>Número total de intentos interrumpidos:</label>
                    <input 
                      type="number" 
                      v-model.number="assessment.interruptedAttempt.totalAttempts"
                      min="0"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Intento abortado -->
            <div class="assessment-item">
              <h4>Intento Abortado</h4>
              <p class="description">
                Cuando la persona empieza a prepararse pero se detiene por sí misma antes de tener un comportamiento autodestructivo.
              </p>
              <div class="questions">
                <p>¿Ha habido algún momento en que empezaste a hacer algo para dejar de vivir pero cambiaste de idea?</p>
              </div>
              <div class="response-section">
                <div class="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.abortedAttempt.present" 
                      :value="true"
                      required
                    > Sí
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.abortedAttempt.present" 
                      :value="false"
                      required
                    > No
                  </label>
                </div>
                <div v-if="assessment.abortedAttempt.present" class="additional-info">
                  <textarea
                    v-model="assessment.abortedAttempt.description"
                    placeholder="Describe lo que sucedió..."
                    rows="2"
                  ></textarea>
                  <div class="number-input">
                    <label>Número total de intentos abortados:</label>
                    <input 
                      type="number" 
                      v-model.number="assessment.abortedAttempt.totalAttempts"
                      min="0"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Actos preparatorios -->
            <div class="assessment-item">
              <h4>Actos o Comportamiento Preparatorios</h4>
              <p class="description">
                Actos o preparativos para llevar a cabo un inminente intento de suicidio.
              </p>
              <div class="questions">
                <p>¿Has hecho algo para estar listo/a para dejar de vivir, como regalar cosas, escribir una nota de despedida?</p>
              </div>
              <div class="response-section">
                <div class="radio-group">
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.preparatoryActs.present" 
                      :value="true"
                      required
                    > Sí
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      v-model="assessment.preparatoryActs.present" 
                      :value="false"
                      required
                    > No
                  </label>
                </div>
                <textarea
                  v-if="assessment.preparatoryActs.present"
                  v-model="assessment.preparatoryActs.description"
                  placeholder="Describe los actos preparatorios..."
                  rows="2"
                ></textarea>
              </div>
            </div>

            <!-- Letalidad -->
            <div v-if="assessment.actualAttempt.present" class="assessment-item">
              <h4>Grado de Letalidad y Lesiones</h4>
              <div class="select-group">
                <label>Grado de letalidad:</label>
                <select v-model.number="assessment.lethalityDegree" required>
                  <option value="0">0 - No hay daño físico o muy poco daño físico</option>
                  <option value="1">1 - Daño físico menor</option>
                  <option value="2">2 - Daño físico moderado</option>
                  <option value="3">3 - Daño físico moderadamente grave</option>
                  <option value="4">4 - Daño físico grave</option>
                  <option value="5">5 - Muerte</option>
                </select>
              </div>

              <div v-if="assessment.lethalityDegree === 0" class="select-group">
                <label>Letalidad potencial:</label>
                <select v-model.number="assessment.potentialLethality" required>
                  <option value="0">0 - Comportamiento con poca probabilidad de lesiones</option>
                  <option value="1">1 - Comportamiento con probabilidad de lesiones pero no de muerte</option>
                  <option value="2">2 - Comportamiento con probabilidad de muerte</option>
                </select>
              </div>

              <div class="date-input">
                <label>Fecha del intento más letal:</label>
                <input 
                  type="date" 
                  v-model="assessment.mostLethalAttemptDate"
                  :max="today"
                  required
                >
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
        <button class="btn btn-primary" @click="submitAssessment">Guardar Evaluación</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  name: 'SuicideAssessmentForm',
  props: {
    studentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      today: new Date().toISOString().split('T')[0],
      assessment: {
        studentId: this.studentId,
        deathWish: {
          present: null,
          description: ''
        },
        nonSpecificActiveSuicidalThoughts: {
          present: null,
          description: ''
        },
        activeSuicidalIdeationWithMethods: {
          present: null,
          description: ''
        },
        activeSuicidalIdeationWithIntent: {
          present: null,
          description: ''
        },
        activeSuicidalIdeationWithPlan: {
          present: null,
          description: ''
        },
        ideationIntensity: {
          mostSeriousIdeationType: '',
          mostSeriousIdeationDescription: '',
          frequency: null
        },
        observations: '',
        // Comportamiento Suicida
        actualAttempt: {
          present: null,
          description: '',
          totalAttempts: 0
        },
        nonSuicidalSelfInjury: {
          present: null,
          description: ''
        },
        unknownIntentSelfInjury: {
          present: null,
          description: ''
        },
        interruptedAttempt: {
          present: null,
          description: '',
          totalAttempts: 0
        },
        abortedAttempt: {
          present: null,
          description: '',
          totalAttempts: 0
        },
        preparatoryActs: {
          present: null,
          description: ''
        },
        completedSuicide: false,
        mostLethalAttemptDate: '',
        lethalityDegree: 0,
        potentialLethality: 0
      }
    }
  },
  computed: {
    // Mostrar preguntas adicionales solo si la pregunta 2 es positiva
    showAdditionalIdeation() {
      return this.assessment.nonSpecificActiveSuicidalThoughts.present === true;
    },
    showIntensitySection() {
      // Mostrar si la pregunta 1 o 2 son positivas
      return this.assessment.deathWish.present === true || 
             this.assessment.nonSpecificActiveSuicidalThoughts.present === true;
    },
    canShowBehaviorSection() {
      // Solo mostrar la sección de comportamiento si ambas preguntas son negativas
      return this.assessment.deathWish.present === false && 
             this.assessment.nonSpecificActiveSuicidalThoughts.present === false;
    },
    shouldSkipValidation() {
      // Si ambas son negativas, no se requiere validación
      return this.assessment.deathWish.present === false && 
             this.assessment.nonSpecificActiveSuicidalThoughts.present === false;
    }
  },
  watch: {
    shouldSkipValidation(skip) {
      if (skip) {
        // Si no hay ideación suicida, establecer todos los campos de comportamiento en false
        this.assessment.actualAttempt.present = false;
        this.assessment.nonSuicidalSelfInjury.present = false;
        this.assessment.unknownIntentSelfInjury.present = false;
        this.assessment.interruptedAttempt.present = false;
        this.assessment.abortedAttempt.present = false;
        this.assessment.preparatoryActs.present = false;
      }
    },
    'assessment.deathWish.present'() {
      this.checkIdeation();
    },
    'assessment.nonSpecificActiveSuicidalThoughts.present'() {
      this.checkIdeation();
    }
  },
  methods: {
    checkIdeation() {
      // Si la pregunta 2 es negativa, establecer las preguntas 3-5 en false
      if (!this.assessment.nonSpecificActiveSuicidalThoughts.present) {
        this.assessment.activeSuicidalIdeationWithMethods.present = false;
        this.assessment.activeSuicidalIdeationWithMethods.description = '';
        this.assessment.activeSuicidalIdeationWithIntent.present = false;
        this.assessment.activeSuicidalIdeationWithIntent.description = '';
        this.assessment.activeSuicidalIdeationWithPlan.present = false;
        this.assessment.activeSuicidalIdeationWithPlan.description = '';
      }

      // Si ambas respuestas son negativas, establecer valores por defecto para comportamiento
      if (this.assessment.deathWish.present === false && 
          this.assessment.nonSpecificActiveSuicidalThoughts.present === false) {
        this.assessment.actualAttempt.present = false;
        this.assessment.nonSuicidalSelfInjury.present = false;
        this.assessment.unknownIntentSelfInjury.present = false;
        this.assessment.interruptedAttempt.present = false;
        this.assessment.abortedAttempt.present = false;
        this.assessment.preparatoryActs.present = false;
      }
    },
    async submitAssessment() {
      // Validar que se hayan respondido todas las preguntas necesarias
      let mensaje = '';
      
      // Si las preguntas 1 y 2 no están respondidas
      if (this.assessment.deathWish.present === null || 
          this.assessment.nonSpecificActiveSuicidalThoughts.present === null) {
        mensaje = 'Por favor, responda las preguntas 1 y 2 de Ideación Suicida antes de continuar.';
      }
      // Si la pregunta 2 es positiva y faltan preguntas 3,4,5
      else if (this.assessment.nonSpecificActiveSuicidalThoughts.present === true && 
               (this.assessment.activeSuicidalIdeationWithMethods.present === null ||
                this.assessment.activeSuicidalIdeationWithIntent.present === null ||
                this.assessment.activeSuicidalIdeationWithPlan.present === null)) {
        mensaje = 'Por favor, responda todas las preguntas de Ideación Suicida antes de continuar.';
      }
      // Si hay ideación (pregunta 1 o 2 positiva) y faltan datos de intensidad
      else if (this.showIntensitySection && 
               (!this.assessment.ideationIntensity.mostSeriousIdeationType ||
                !this.assessment.ideationIntensity.mostSeriousIdeationDescription ||
                this.assessment.ideationIntensity.frequency === null)) {
        mensaje = 'Por favor, complete la sección de Intensidad de la Ideación.';
      }
      // Si no es comportamiento suicida y faltan preguntas de ideación
      else if (!this.canShowBehaviorSection && 
               this.assessment.nonSpecificActiveSuicidalThoughts.present === false && 
               this.assessment.deathWish.present === true) {
        mensaje = 'Por favor, complete la evaluación de Ideación Suicida.';
      }

      if (mensaje) {
        await Swal.fire({
          icon: 'warning',
          title: 'Validación',
          text: mensaje
        });
        return;
      }

      // Si las preguntas 1 y 2 son negativas, no se requiere validación adicional
      if (this.shouldSkipValidation) {
        this.assessment.actualAttempt.present = false;
        this.assessment.nonSuicidalSelfInjury.present = false;
        this.assessment.unknownIntentSelfInjury.present = false;
        this.assessment.interruptedAttempt.present = false;
        this.assessment.abortedAttempt.present = false;
        this.assessment.preparatoryActs.present = false;
      }
      try {
        const token = localStorage.getItem('x-token')
        const response = await axios.post(
          'http://localhost:3000/api/suicide-assessments',
          {
            studentId: this.studentId,
            ...this.assessment
          },
          {
            headers: {
              'x-token': token
            }
          }
        )

        if (response.data.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Evaluación Guardada',
            text: 'La evaluación ha sido registrada exitosamente'
          })
          this.$emit('assessment-created', response.data.assessment)
          this.$emit('close')
        }
      } catch (error) {
        console.error('Error:', error)
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al guardar la evaluación'
        })
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

.assessment-form {
  font-family: 'Poppins', sans-serif;
  padding: 1rem;
}

.modal-header {
  background: #7F53AC;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.modal-window {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
}

.assessment-section {
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.assessment-section h3 {
  color: #333;
}

.assessment-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: white;
}

.response-section {
  margin-top: 1rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.radio-group label:hover {
  background: #edf2f7;
  color: #2d3748;
}

.radio-group input[type="radio"] {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #7F53AC;
}

textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
  font-family: 'Poppins', sans-serif;
}

textarea:focus {
  outline: none;
  border-color: #7F53AC;
  box-shadow: 0 0 0 2px rgba(127, 83, 172, 0.1);
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  border: none;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: #7F53AC;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #6b4593;
}

.btn-secondary {
  background: var(--neutral-light);
  color: var(--neutral-dark);
}

.behavior-section {
  border: 2px solid var(--primary-color);
  position: relative;
}

.behavior-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
}
</style>
