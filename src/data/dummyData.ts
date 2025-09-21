export interface Transaction {
  id: string;
  date: string;
  type: 'орлого' | 'зарлага';
  category: string;
  amount: number;
  description: string;
}

export const categories = {
  орлого: ['Борлуулалт', 'Бусад орлого', 'Хүү орлого'],
  зарлага: ['Худалдан авалт', 'Тээвэр', 'Гааль', 'Цалин хөлс', 'Түрээс', 'Маркетинг', 'Бусад зарлага']
};

export const dummyTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-12-01',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 2500000,
    description: 'Michelin дугуй 20 ширхэг'
  },
  {
    id: '2',
    date: '2025-12-01',
    type: 'зарлага',
    category: 'Худалдан авалт',
    amount: 1800000,
    description: 'Дугуй импорт'
  },
  {
    id: '3',
    date: '2025-12-02',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 1200000,
    description: 'Bridgestone дугуй 10 ширхэг'
  },
  {
    id: '4',
    date: '2025-12-02',
    type: 'зарлага',
    category: 'Тээвэр',
    amount: 150000,
    description: 'Ачаа тээвэрлэх зардал'
  },
  {
    id: '5',
    date: '2025-12-03',
    type: 'зарлага',
    category: 'Гааль',
    amount: 300000,
    description: 'Гаалийн татвар'
  },
  {
    id: '6',
    date: '2025-12-04',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 3200000,
    description: 'Continental дугуй 25 ширхэг'
  },
  {
    id: '7',
    date: '2025-12-05',
    type: 'зарлага',
    category: 'Цалин хөлс',
    amount: 800000,
    description: 'Ажилтны цалин'
  },
  {
    id: '8',
    date: '2025-12-06',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 1800000,
    description: 'Pirelli дугуй 15 ширхэг'
  },
  {
    id: '9',
    date: '2025-12-07',
    type: 'зарлага',
    category: 'Түрээс',
    amount: 500000,
    description: 'Агуулахын түрээс'
  },
  {
    id: '10',
    date: '2025-12-08',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 2800000,
    description: 'Goodyear дугуй 20 ширхэг'
  },
  {
    id: '11',
    date: '2025-11-28',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 1500000,
    description: 'Сарын сүүлийн борлуулалт'
  },
  {
    id: '12',
    date: '2025-11-25',
    type: 'зарлага',
    category: 'Маркетинг',
    amount: 200000,
    description: 'Сурталчилгааны зардал'
  },
  {
    id: '13',
    date: '2025-11-20',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 4200000,
    description: 'Том захиалгын борлуулалт'
  },
  {
    id: '14',
    date: '2025-11-15',
    type: 'зарлага',
    category: 'Худалдан авалт',
    amount: 2800000,
    description: 'Шинэ дугуй импорт'
  },
  {
    id: '15',
    date: '2025-11-10',
    type: 'орлого',
    category: 'Борлуулалт',
    amount: 1900000,
    description: 'Жирийн борлуулалт'
  }
];