export interface DbUsersystem {
  id: string;          
  name: string;
  email: string;
  password: string;
  status: number;
  createdat: string; 
  createdby: string;
  updatedat: string | null;
  updatedby: string | null;
}