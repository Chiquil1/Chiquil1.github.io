export async function fetchApi(url: string, options?: RequestInit): Promise<any> {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
  return response.json();
}

export async function fetchProto(url: string, options?: RequestInit): Promise<ArrayBuffer> {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Proto request failed: ${response.statusText}`);
  return response.arrayBuffer();
}

export async function fetchText(url: string, options?: RequestInit): Promise<string> {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Text request failed: ${response.statusText}`);
  return response.text();
}