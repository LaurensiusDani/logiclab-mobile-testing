export type ClassSession = {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  students: string[];
};

export type Faculty = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  classes: ClassSession[];
};

export const faculties: Faculty[] = [
  {
    id: 'fti',
    name: 'Fakultas Teknologi Industri',
    shortName: 'FTI',
    color: 'orange',
    icon: '⚙️',
    classes: [
      { 
        id: 'ti-101', 
        code: 'TI-101', 
        name: 'Intro to Industrial Eng.',
        lecturer: 'Dr. Budi Santoso',
        students: ['Ahmad Pratama', 'Siti Nurhaliza', 'Andi Wijaya']
      },
      { 
        id: 'ti-102', 
        code: 'TI-102', 
        name: 'Operations Research',
        lecturer: 'Prof. Dewi Lestari',
        students: ['Ahmad Pratama', 'Maya Putri']
      }
    ]
  },
  {
    id: 'stei',
    name: 'Sekolah Teknik Elektro dan Informatika',
    shortName: 'STEI',
    color: 'blue',
    icon: '💻',
    classes: [
      { 
        id: 'if-101', 
        code: 'IF-101', 
        name: 'Intro to CS',
        lecturer: 'Dr. Rinaldi Munir',
        students: ['Ahmad Pratama', 'Budi Hartono', 'Citra Dewi', 'Dani Firmansyah']
      },
      { 
        id: 'if-102', 
        code: 'IF-102', 
        name: 'Data Structures',
        lecturer: 'Dr. Nur Ulfa',
        students: ['Ahmad Pratama', 'Eko Prasetyo']
      },
      { 
        id: 'if-201', 
        code: 'IF-201', 
        name: 'Computational Thinking',
        lecturer: 'Prof. Hendra Gunawan',
        students: ['Ahmad Pratama', 'Farah Diba', 'Gilang Ramadhan']
      },
      { 
        id: 'el-102', 
        code: 'EL-102', 
        name: 'Digital Systems',
        lecturer: 'Dr. Iwan Setiawan',
        students: ['Hadi Susanto', 'Indah Permata']
      }
    ]
  },
  {
    id: 'sith',
    name: 'Sekolah Ilmu dan Teknologi Hayati',
    shortName: 'SITH',
    color: 'green',
    icon: '🧬',
    classes: [
      { 
        id: 'bi-101', 
        code: 'BI-101', 
        name: 'Bioinformatics',
        lecturer: 'Dr. Joko Widodo',
        students: ['Kartika Sari', 'Linda Wijaya']
      },
      { 
        id: 'bi-102', 
        code: 'BI-102', 
        name: 'Molecular Biology',
        lecturer: 'Prof. Maria Ulfa',
        students: ['Nina Marlina', 'Oscar Pratama']
      }
    ]
  },
  {
    id: 'ftmd',
    name: 'Fakultas Teknik Mesin dan Dirgantara',
    shortName: 'FTMD',
    color: 'red',
    icon: '✈️',
    classes: [
      { 
        id: 'ms-101', 
        code: 'MS-101', 
        name: 'Engineering Mechanics',
        lecturer: 'Dr. Prasetyo Adi',
        students: ['Qori Abdullah', 'Rina Kusuma']
      },
      { 
        id: 'ae-101', 
        code: 'AE-101', 
        name: 'Aerospace Eng.',
        lecturer: 'Prof. Surya Atmaja',
        students: ['Teguh Santoso', 'Umar Bakri']
      }
    ]
  },
  {
    id: 'ftsl',
    name: 'Fakultas Teknik Sipil dan Lingkungan',
    shortName: 'FTSL',
    color: 'yellow',
    icon: '🏗️',
    classes: [
      { 
        id: 'si-101', 
        code: 'SI-101', 
        name: 'Statics & Mechanics',
        lecturer: 'Dr. Vina Setiawati',
        students: ['Wahyu Hidayat', 'Xenia Putri']
      },
      { 
        id: 'tl-101', 
        code: 'TL-101', 
        name: 'Environmental Eng.',
        lecturer: 'Prof. Yudi Prasetyo',
        students: ['Zahra Amalia', 'Ahmad Pratama']
      }
    ]
  },
  {
    id: 'fttm',
    name: 'Fakultas Teknik Pertambangan dan Perminyakan',
    shortName: 'FTTM',
    color: 'purple',
    icon: '⛏️',
    classes: [
      { 
        id: 'tm-101', 
        code: 'TM-101', 
        name: 'Intro to Mining',
        lecturer: 'Dr. Arif Budiman',
        students: ['Bambang Sutrisno', 'Candra Wijaya']
      }
    ]
  }
];