# DOM Communicator
Esta lib usa o padrão Pub-Sub para registrar eventos Browser. O Communicator usa padrão singleton para instanciar um módulo de comunicação, em que é possível instanciar diferentes comunicadores a partir de chaves únicas.

## Instalando

- [dom-communicator](https://npmjs.com/package/dom-communicator)

```bash
yarn add dom-communicator
```

## Como usar
No exemplo abaixo, temos uma comunicação utilizando os métodos `subscribe`, `unsubscribe` e `publish`:

```ts
import DOMCommunicator from "dom-communicator";

const isBrowser = typeof window !== "undefined";

function main() {
  if (!isBrowser) return;
  
  const communicator = DOMCommunicator.getInstance();
  
  const unsubscribeEventFoo = communicator.subscribe("foo", (data) => {
    console.log("foo", data);
  });
  
  communicator.publish("foo", "bar");
  // console.log => "foo", "bar"
  
  unsubscribeEventA();
  communicator.publish("foo", "bar");
  // nothing
}

main();

```

### Criando e comunicando com uma outra instancia

Caso haja a necessidade de criar um comunicador em uma chave diferente, é possível usar o método `getInstance` passando um valor para a `key`, por padrão o método `getInstance` adiciona o comunicador à chave `__COMMUNICATOR__`:

```ts
const PERSONAL_KEY = "__PERSONAL_KEY__";
const personalCommunicator = DOMCommunicator.getInstance(PERSONAL_KEY);
export default personalCommunicator;
```

Dessa forma sempre que a comunicação for realizada dentro do contexto `__PERSONAL_KEY__`, basta usar o `getInstance` com essa chave.

### unsubscribe
Outra forma de fazer o `unsubscribe` é repassando a função de callback diretamente da seguinte forma:

```ts
...
  const communicator = DOMCommunicator.getInstance();

  const callback = () => null;

  // Adiciona o método callback no evento "foo"
  communicator.subscribe("foo", callback);

  // Remove o método callback no evento "foo"
  communicator.unsubscribe("foo", callback);
...
```
