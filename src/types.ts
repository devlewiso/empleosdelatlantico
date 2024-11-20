export interface JobPost {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  phone: string;
  likes: number;
  timestamp: number;
  reports: number;
  hidden: boolean;
}