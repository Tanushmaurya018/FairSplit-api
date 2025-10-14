export interface IGroup {
  name: string;
  createdBy: ObjectId; // User _id
  members: string[]; // Array of User _id
}
