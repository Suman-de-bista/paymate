export interface Group {
    id: string;
    name: string;
    description: string;
    balance: number;
    members: GroupMember[];
    transactions: Transaction[];
  }

export interface User {
    id: string;
    email: string;
    name: string;
  }
  
export interface GroupMember {
    id: string;
    email: string;
    name: string;
  }

export interface Transaction {
    group_id: string;
    name: string;
    description: string;
    amount: number;
    paid_by: string;
    split_between: string[];
    date: number;
}