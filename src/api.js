export async function fetch_endpoint(url) {
  return (await fetch(url)).json()
}
