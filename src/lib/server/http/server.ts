import type { DefaultError } from "../../../app";

export const http = {
  request: async function request(input: RequestInfo, init?: RequestInit | undefined, timeout = 6000): Promise<Response> {

    const controller = new AbortController();
    const id = setTimeout(() => {
      controller.abort({ message: "Timeout", code: 408 });
    }, timeout);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      const expectedError = error as DefaultError;
      if (expectedError?.code === 408) {
        return timeoutResponseError();
      }
      return unexpectedResponseError();
    }

  }
}

function timeoutResponseError(): Response {
  const obj = { message: "Sistema indisponível, tente em breve!" };
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  return new Response(blob, { status: 408 });
}

function unexpectedResponseError(): Response {
  const obj = { message: "Vixe maria, deu ruim! Estamos com problemas, tente em breve!" };
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  return new Response(blob, { status: 503 });
}