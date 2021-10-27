// export makes the interface available outside of this file
export interface Report {
  id: string,
  title: string,
  companyName: string,
  reporterId: string,
  rating: number,
  date: Date,
  comment: string,
  creator: string
}
