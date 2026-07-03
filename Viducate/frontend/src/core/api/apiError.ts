export default function handleApiError(error: any): string {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  return "Something went wrong";
}
