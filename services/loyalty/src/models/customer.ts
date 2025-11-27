export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  lastVisit?: string;
  totalVisits: number;
  totalPoints: number;
}
