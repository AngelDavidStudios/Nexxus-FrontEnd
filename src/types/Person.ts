export interface Person {
    id?: number;
    dni: string;
    gender: 'M' | 'F' | 'O';
    firstName: string;
    lastName: string;
    birthDate: string;
    address: string;
  }