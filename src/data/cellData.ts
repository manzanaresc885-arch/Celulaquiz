import { Question, OrganelleInfo, DifficultyLevel } from '../types';

export const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'nucleo',
    name: 'Núcleo',
    analogy: 'El Cerebro o el Centro de Control de la Ciudad',
    description: 'Guarda el ADN (material genético) y coordina todas las actividades de la célula como la reproducción y el crecimiento.',
    color: '#00E5FF', // Cyan
    iconName: 'Cpu',
    foundIn: ['animal', 'plant'],
    funFact: '¡Si estiraras todo el ADN dentro del núcleo de una sola célula humana, mediría casi 2 metros!',
    svgPath: 'M 150 150 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0'
  },
  {
    id: 'mitocondria',
    name: 'Mitocondria',
    analogy: 'La Central Eléctrica',
    description: 'Produce la mayor parte de la energía celular (ATP) mediante la respiración celular.',
    color: '#FF2A85', // Neon Pink / Crimson
    iconName: 'Zap',
    foundIn: ['animal', 'plant'],
    funFact: '¡Tienen su propio ADN independiente del núcleo y se cree que antes eran bacterias libres!',
    svgPath: 'M 220 120 C 240 100 270 110 260 130 C 250 150 210 140 220 120 Z'
  },
  {
    id: 'cloroplasto',
    name: 'Cloroplasto',
    analogy: 'Los Paneles Solares y Cocina',
    description: 'Transforma la luz solar, agua y dióxido de carbono en glucosa (alimento) y oxígeno mediante la fotosíntesis.',
    color: '#00FF88', // Bioluminescent Emerald
    iconName: 'Sun',
    foundIn: ['plant'],
    funFact: '¡Contienen clorofila, el pigmento verde que le da su color a las plantas y hojas!',
    svgPath: 'M 80 200 C 100 180 130 190 120 220 C 110 240 70 220 80 200 Z'
  },
  {
    id: 'membrana',
    name: 'Membrana Plasmática',
    analogy: 'La Muralla o Seguridad de la Entrada',
    description: 'Capa flexible que rodea la célula y regula selectivamente lo que entra (nutrientes, agua) y sale (desechos).',
    color: '#9D4EDD', // Electric Purple
    iconName: 'Shield',
    foundIn: ['animal', 'plant', 'procaryote'],
    funFact: 'Está formada por una doble capa de lípidos (grasas) que aborrece y atrae el agua al mismo tiempo.',
    svgPath: 'M 50 150 C 50 50 250 50 250 150 C 250 250 50 250 50 150 Z'
  },
  {
    id: 'pared',
    name: 'Pared Celular',
    analogy: 'El Escudo de Concreto Exterior',
    description: 'Estructura rígida de celulosa exterior a la membrana que le da soporte y protección estructural a la célula vegetal.',
    color: '#2ECC71', // Bright Green
    iconName: 'Box',
    foundIn: ['plant', 'procaryote'],
    funFact: '¡Es lo que le da rigidez a los troncos de los árboles y el crujido a la lechuga fresca!',
    svgPath: 'M 30 150 C 30 30 270 30 270 150 C 270 270 30 270 30 150 Z'
  },
  {
    id: 'ribosoma',
    name: 'Ribosoma',
    analogy: 'Las Fábricas de Construcción',
    description: 'Ensamblan aminoácidos para sintetizar proteínas necesarias para la estructura y funcionamiento celular.',
    color: '#FFC800', // Gold / Amber
    iconName: 'Hammer',
    foundIn: ['animal', 'plant', 'procaryote'],
    funFact: '¡Una sola célula hepática humana puede contener hasta 10 millones de ribosomas!',
    svgPath: 'M 120 100 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0'
  },
  {
    id: 'reticulo',
    name: 'Retículo Endoplásmico',
    analogy: 'La Red de Carreteras y Transporte Interior',
    description: 'Red de membranas interconectadas que sintetizan y transportan lípidos (liso) y proteínas (rugoso).',
    color: '#FF6B6B', // Soft Coral
    iconName: 'Network',
    foundIn: ['animal', 'plant'],
    funFact: 'Se divide en Rugoso (con ribosomas pegados) y Liso (sin ribosomas y desintoxicante).',
    svgPath: 'M 120 140 Q 110 120 130 110 Q 150 120 140 140'
  },
  {
    id: 'golgi',
    name: 'Aparato de Golgi',
    analogy: 'El Centro de Envío y Correos (FedEx Celular)',
    description: 'Modifica, empaqueta y distribuye las proteínas y lípidos que vienen del retículo endoplásmico.',
    color: '#FF00FF', // Magenta
    iconName: 'Package',
    foundIn: ['animal', 'plant'],
    funFact: 'Descubierto en 1898 por Camillo Golgi usando una técnica de tinción con plata.',
    svgPath: 'M 180 180 C 190 170 210 170 220 180 C 210 190 190 190 180 180'
  },
  {
    id: 'vacuola',
    name: 'Vacuola Central',
    analogy: 'El Tanque de Agua Gigante',
    description: 'Almacena agua, nutrientes y desechos. En células vegetales es enorme y mantiene la turgencia (presión interna).',
    color: '#3498DB', // Sky Blue
    iconName: 'Droplet',
    foundIn: ['plant', 'animal'],
    funFact: '¡En células vegetales adultas puede ocupar hasta el 90% del volumen celular!',
    svgPath: 'M 140 200 C 160 180 200 190 190 220 C 180 240 130 230 140 200 Z'
  },
  {
    id: 'lisosoma',
    name: 'Lisosoma',
    analogy: 'El Sistema de Reciclaje y Basurero Celular',
    description: 'Contiene enzimas digestivas para descomponer residuos, organelos viejos y sustancias invasoras.',
    color: '#E67E22', // Neon Orange
    iconName: 'Trash2',
    foundIn: ['animal'],
    funFact: 'Si un lisosoma se rompe masivamente, puede digerir a su propia célula (autólisis).',
    svgPath: 'M 100 170 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0'
  }
];

export const MOTIVATIONAL_CHARACTERS = [
  {
    name: 'Profesor Célulo',
    role: 'Biólogo Mayor',
    avatar: '🦠',
    quotes: [
      '¡No te preocupes! Hasta las mejores células sufren pequeñas mutaciones. ¡Aprender es evolucionar!',
      '¡Tranquilo! El error es solo el primer paso hacia el conocimiento científico.',
      '¡Casi lo tienes! Tu cerebro está creando nuevas sinapsis justo ahora.',
      '¡Sigue adelante! Cada pregunta incorrecta te acerca un paso más a ser un Biólogo Experto.'
    ]
  },
  {
    name: 'Mitocó-Max',
    role: 'Generador de Energía',
    avatar: '⚡',
    quotes: [
      '¡Recarga tu ATP! Un tropiezo no detiene nuestra respiración celular.',
      '¡Siente la energía! La ciencia requiere perseverancia y curiosidad.',
      '¡No pierdas el impulso! Las mitocondrias nunca dejan de producir ATP para ti.'
    ]
  },
  {
    name: 'Ameba Animadora',
    role: 'Asistente Optimista',
    avatar: '🧫',
    quotes: [
      '¡Usa tus seudópodos y abraza el aprendizaje! ¡Tú puedes lograrlo!',
      '¡Inténtalo de nuevo! Ninguna célula se rindió en 3.500 millones de años de evolución.',
      '¡Vas muy bien! Disfruta descubriendo los secretos del micro-mundo.'
    ]
  }
];

export const QUESTIONS: Question[] = [
  // EASY LEVEL
  {
    id: 'q_easy_1',
    question: '¿Cuál es la función principal del Núcleo en la célula?',
    options: [
      'Dirigir y controlar las actividades de la célula almacenando el ADN',
      'Producir azúcares mediante la luz solar',
      'Digerir los desechos celulares',
      'Bombear sangre a todo el cuerpo'
    ],
    correctIndex: 0,
    explanation: 'El núcleo contiene el material genético (ADN) y actúa como el cerebro o centro de mando de la célula.',
    difficulty: 'easy',
    organelleId: 'nucleo',
    category: 'organelos',
    hint: 'Piensa en qué parte actúa como el cerebro o la computadora central.'
  },
  {
    id: 'q_easy_2',
    question: '¿Qué organelo se conoce como la "central eléctrica" de la célula porque produce energía (ATP)?',
    options: ['Vacuola', 'Mitocondria', 'Lisosoma', 'Pared Celular'],
    correctIndex: 1,
    explanation: 'Las mitocondrias convierten la glucosa y oxígeno en energía utilizable llamada ATP.',
    difficulty: 'easy',
    organelleId: 'mitocondria',
    category: 'organelos',
    hint: 'Es la encargada de la respiración celular y dar energía.'
  },
  {
    id: 'q_easy_3',
    question: '¿Qué organelo exclusivo de las células vegetales realiza la fotosíntesis?',
    options: ['Ribosoma', 'Cloroplasto', 'Aparato de Golgi', 'Centriolo'],
    correctIndex: 1,
    explanation: 'Los cloroplastos contienen clorofila y captan la luz del sol para producir glucosa y oxígeno.',
    difficulty: 'easy',
    organelleId: 'cloroplasto',
    category: 'organelos',
    hint: '¡Tiene clorofila y es verde!'
  },
  {
    id: 'q_easy_4',
    question: '¿Qué capa rodea a TODAS las células y controla qué sustancias entran y salen?',
    options: ['Membrana plasmática', 'Pared de madera', 'Núcleo duro', 'Capa de cera'],
    correctIndex: 0,
    explanation: 'La membrana plasmática es semipermeable y rodea a todas las células existentes.',
    difficulty: 'easy',
    organelleId: 'membrana',
    category: 'transport',
    hint: 'Actúa como el guardia de seguridad en los límites de la célula.'
  },
  {
    id: 'q_easy_5',
    question: '¿Qué estructura da rigidez y soporte exterior a la célula VEGETAL pero no a la animal?',
    options: ['Lisosoma', 'Pared celular', 'Citoplasma', 'Ribosoma'],
    correctIndex: 1,
    explanation: 'La pared celular está hecha de celulosa y proporciona forma fija y resistencia a las plantas.',
    difficulty: 'easy',
    organelleId: 'pared',
    category: 'comparison',
    hint: 'Es dura y rígida, hecha de celulosa.'
  },
  {
    id: 'q_easy_6',
    question: '¿Cuál es el líquido gelatinoso donde flotan los organelos dentro de la célula?',
    options: ['Sangre', 'Citoplasma', 'Clorofila', 'Agua pura'],
    correctIndex: 1,
    explanation: 'El citoplasma o citosol es el fluido acuoso con nutrientes donde ocurren reacciones químicas.',
    difficulty: 'easy',
    category: 'organelles',
    hint: 'Empieza con C y es el fluido celular interno.'
  },

  // MEDIUM LEVEL
  {
    id: 'q_med_1',
    question: '¿Cuál es la principal diferencia entre una célula Procariota y una Eucariota?',
    options: [
      'La procariota NO tiene núcleo definido por membrana y la eucariota SÍ lo tiene',
      'La procariota es 100 veces más grande que la eucariota',
      'La eucariota no tiene ADN',
      'Las procariotas son exclusivas de los animales'
    ],
    correctIndex: 0,
    explanation: 'Las procariotas (como las bacterias) tienen su ADN libre en el citoplasma, mientras que las eucariotas guardan el ADN dentro de un núcleo protegido.',
    difficulty: 'medium',
    category: 'comparison',
    hint: 'Piensa en la presencia o ausencia de núcleo enmarcado.'
  },
  {
    id: 'q_med_2',
    question: '¿Qué estructura es responsable de sintetizar proteínas en la célula?',
    options: ['Ribosoma', 'Lisosoma', 'Peroxisoma', 'Vacuola'],
    correctIndex: 0,
    explanation: 'Los ribosomas leen las instrucciones del ARN para unir aminoácidos y formar proteínas.',
    difficulty: 'medium',
    organelleId: 'ribosoma',
    category: 'organelles',
    hint: 'Son pequeñitos y pueden estar flotando o pegados al Retículo Endoplásmico.'
  },
  {
    id: 'q_med_3',
    question: '¿Qué organelo se encarga de empaquetar, etiquetar y distribuir proteínas hacia su destino final?',
    options: ['Aparato de Golgi', 'Mitocondria', 'Pared celular', 'Núcleo'],
    correctIndex: 0,
    explanation: 'El Aparato de Golgi funciona como una oficina postal celular que modifica y envía sacos de vesículas.',
    difficulty: 'medium',
    organelleId: 'golgi',
    category: 'organelles',
    hint: 'Es la oficina de correos y envíos de la célula.'
  },
  {
    id: 'q_med_4',
    question: '¿Qué ocurre en el proceso de Difusión Facilitada a través de la membrana celular?',
    options: [
      'Las moléculas pasan con ayuda de proteínas de transporte SIN gastar energía (ATP)',
      'La célula gasta muchísima energía para meter agua',
      'La membrana se rompe para dejar pasar sólidos',
      'Las sustancias se convierten en gas instantáneamente'
    ],
    correctIndex: 0,
    explanation: 'La difusión facilitada es un transporte pasivo a favor del gradiente de concentración usando canales proteicos sin consumir ATP.',
    difficulty: 'medium',
    category: 'transport',
    hint: 'Es un tipo de transporte pasivo (sin consumo de ATP).'
  },
  {
    id: 'q_med_5',
    question: '¿Cuál es la función digestiva de los Lisosomas?',
    options: ['Contener enzimas para descomponer desechos y organelos obsoletos', 'Sintetizar ADN', 'Producir glucosa', 'Filtrar la luz solar'],
    correctIndex: 0,
    explanation: 'Los lisosomas contienen enzimas hidrolíticas para digerir sustancias no deseadas o reciclables.',
    difficulty: 'medium',
    organelleId: 'lisosoma',
    category: 'functions',
    hint: 'Funciona como el estómago y sistema de reciclaje.'
  },

  // HARD LEVEL
  {
    id: 'q_hard_1',
    question: '¿En qué fase del ciclo celular la célula duplica su ADN antes de la mitosis?',
    options: ['Fase S de la Interfase', 'Profase', 'Anafase', 'Citocinesis'],
    correctIndex: 0,
    explanation: 'Durante la Fase S (Síntesis) de la interfase, la célula hace una copia exacta de todo su material genético.',
    difficulty: 'hard',
    category: 'genetics',
    hint: 'S viene de Síntesis del ADN.'
  },
  {
    id: 'q_hard_2',
    question: '¿Qué molécula es la principal "moneda de energía" utilizada en el trabajo metabólico celular?',
    options: ['ATP (Adenosín Trifosfato)', 'ADN (Ácido Desoxirribonucleico)', 'ARNm', 'Glucógeno puro'],
    correctIndex: 0,
    explanation: 'El ATP almacena energía en sus enlaces fosfato de alta energía y la libera cuando la célula la necesita.',
    difficulty: 'hard',
    category: 'functions',
    hint: 'A-T-P.'
  },
  {
    id: 'q_hard_3',
    question: '¿Qué postulado de la Teoría Celular afirma que toda célula proviene de otra preexistente?',
    options: [
      'Postulado de origen celular (Rudolf Virchow)',
      'Postulado de conversión de energía',
      'Ley de la gravedad celular',
      'Teoría de la generación espontánea'
    ],
    correctIndex: 0,
    explanation: '"Omnis cellula e cellula": las células no se crean por generación espontánea, sino por división de células preexistentes.',
    difficulty: 'hard',
    category: 'functions',
    hint: 'Virchow propuso que todas se derivan de la división de otras células.'
  },
  {
    id: 'q_hard_4',
    question: '¿Qué diferencia crucial existe entre la Mitosis y la Meiosis?',
    options: [
      'La mitosis produce 2 células diploides idénticas y la meiosis produce 4 células haploides genéticamente variadas',
      'La mitosis solo ocurre en bacterias',
      'La meiosis produce duplicación de organelos sin dividir el núcleo',
      'No hay diferencia, son palabras sinónimas'
    ],
    correctIndex: 0,
    explanation: 'La mitosis es para crecimiento/reparación somática (2n). La meiosis forma gametos sexuales (n) reduciendo a la mitad los cromosomas con recombinación genómica.',
    difficulty: 'hard',
    category: 'genetics',
    hint: 'La meiosis es para la formación de gametos (espermatozoides y óvulos) con variabilidad.'
  },
  {
    id: 'q_easy_7',
    question: '¿Qué organelo celular funciona como un canal de transporte interno (Liso y Rugoso)?',
    options: ['Retículo Endoplásmico', 'Lisosoma', 'Pared celular', 'Cloroplasto'],
    correctIndex: 0,
    explanation: 'El Retículo Endoplásmico transporta materiales. El Rugoso tiene ribosomas adheridos y el Liso sintetiza lípidos.',
    difficulty: 'easy',
    organelleId: 'reticulo',
    category: 'organelos',
    hint: 'Tiene formas llamadas Rugoso y Liso.'
  },
  {
    id: 'q_easy_8',
    question: '¿Qué gran saco de almacenamiento de agua y nutrientes destaca en las células vegetales?',
    options: ['Gran Vacuola Central', 'Centriolo', 'Peroxisoma', 'Citoesqueleto'],
    correctIndex: 0,
    explanation: 'La gran vacuola central almacena agua y mantiene la presión de turgencia en plantas.',
    difficulty: 'easy',
    organelleId: 'vacuola',
    category: 'organelos',
    hint: 'Guarda agua y nutrientes en plantas.'
  },
  {
    id: 'q_med_6',
    question: '¿Cuál es la función del Citoesqueleto?',
    options: [
      'Dar soporte estructural, forma y permitir el movimiento interno de vesículas',
      'Filtrar la entrada de rayos ultravioleta',
      'Producir hormonas en el núcleo',
      'Eliminar todo el oxígeno sobrante'
    ],
    correctIndex: 0,
    explanation: 'Formado por microtúbulos y microfilamentos, el citoesqueleto da sostén y sirve de red de transporte interno.',
    difficulty: 'medium',
    organelleId: 'citoesqueleto',
    category: 'functions',
    hint: 'Actúa como el armazón o esqueleto de la célula.'
  },
  {
    id: 'q_med_7',
    question: '¿Qué organelos están involucrados en la división celular animal formando el huso acromático?',
    options: ['Centriolos', 'Lisosomas', 'Ribosomas', 'Cloroplastos'],
    correctIndex: 0,
    explanation: 'Los centriolos organizan los microtúbulos durante la división celular en células animales.',
    difficulty: 'medium',
    organelleId: 'centriolo',
    category: 'organelles',
    hint: 'Tienen forma de tubitos o cilindros perpendiculares.'
  },
  {
    id: 'q_hard_5',
    question: '¿Qué sucede durante la Endocitosis y Exocitosis?',
    options: [
      'La célula transporta grandes partículas envolviéndolas en vesículas (Endo=entra, Exo=sale)',
      'La célula divide su ADN sin usar energía',
      'Las mitocondrias absorben clorofila',
      'Los ribosomas destruyen el ARN'
    ],
    correctIndex: 0,
    explanation: 'Son formas de transporte en masa que requieren gasto de energía (ATP) deformando la membrana.',
    difficulty: 'hard',
    category: 'transport',
    hint: 'Endo significa hacia adentro y Exo significa hacia afuera.'
  },
  {
    id: 'q_hard_6',
    question: '¿Qué función desempeñan los Peroxisomas?',
    options: [
      'Degradar ácidos grasos y neutralizar el peróxido de hidrógeno perjudicial',
      'Sintetizar celulosa para la pared',
      'Capturar fotones de luz solar',
      'Fabricar hemoglobina'
    ],
    correctIndex: 0,
    explanation: 'Los peroxisomas contienen la enzima catalasa para descomponer el H2O2 nocivo en agua y oxígeno.',
    difficulty: 'hard',
    category: 'functions',
    hint: 'Su nombre incluye la palabra "peróxido".'
  }
];

export const TRUE_FALSE_QUESTIONS = [
  {
    statement: 'Las células vegetales tienen mitocondrias Y cloroplastos.',
    isTrue: true,
    explanation: '¡Verdadero! Las plantas necesitan fotosíntesis (cloroplastos) para fabricar alimento y respiración (mitocondrias) para usarlo.'
  },
  {
    statement: 'Las bacterias son organismos eucariotas con núcleo gigante.',
    isTrue: false,
    explanation: '¡Falso! Las bacterias son PROCARIOTAS, lo que significa que no tienen núcleo rodeado por membrana.'
  },
  {
    statement: 'El ADN humano se encuentra guardado dentro del Núcleo.',
    isTrue: true,
    explanation: '¡Verdadero! El núcleo protege el material genético de la célula eucariota.'
  },
  {
    statement: 'Las células animales tienen una pared celular rígida exterior.',
    isTrue: false,
    explanation: '¡Falso! Las células animales solo tienen membrana plasmática flexible. Si tuvieran pared celular rígida, no podríamos mover los músculos fácilmente.'
  },
  {
    statement: 'Los ribosomas son los encargados de la síntesis de proteínas.',
    isTrue: true,
    explanation: '¡Verdadero! Leen el ARN y ensamblan cadenas de aminoácidos.'
  },
  {
    statement: 'El agua entra a la célula principalmente a través del proceso de Osmosis.',
    isTrue: true,
    explanation: '¡Verdadero! La ósmosis es la difusión de moléculas de agua a través de la membrana semipermeable.'
  }
];
