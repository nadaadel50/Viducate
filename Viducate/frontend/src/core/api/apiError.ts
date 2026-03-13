export default function handleApiError(error: any): string {

  console.log(error)

  if (error.response?.data?.detail) {
    return error.response.data.detail
  }
  
  return "Something went wrong"
}