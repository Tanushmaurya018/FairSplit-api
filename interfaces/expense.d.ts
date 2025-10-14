export interface IExpense {
  groupId: ObjectId; // Group _id
  payerId: ObjectId; // User _id
  amount: number;
  title: string;
  participants: string[]; // Array of User _id
}
