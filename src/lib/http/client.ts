
export const api = {
  request: async function request(input: RequestInfo, init?: RequestInit | undefined, timeout = 8000): Promise<Response> {

    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort("Timeout");
    }, timeout);

    // await new Promise(resolve => setTimeout(resolve, 20000))
    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      return new Response(null, { status: 503 })
    }
  }
}