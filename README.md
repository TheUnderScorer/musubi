

<div style="text-align: center">
<h1>
Musubi 🪢
</h1>
<strong>End-to-end typesafe communication. 🎉</strong>
</div>

> ⚠️ This project is a work in progress. It is not yet ready for production use.


## What is Musubi?

Musubi is a library for end-to-end typesafe communication. 
It is inspired by [tRPC](https://github.com/trpc/trpc), but with a focus on modularity and support for multiple environments.

### Features
- ⛑️ Complete type safety for all operations, their inputs and return values.
- 💻 You can easily create multiple schemas for you operations and then merge them into one.
- 👀 Support for subscriptions
- 🔋Batteries included - includes adapters for your favorite frameworks, such as React.js, Next, Vue and more.


## Getting started

I recommend checking examples located in the [packages/examples](packages/examples) directory.

You can use following links to integrate Musubi in your application:

| Name              | Link                                    | Description                                                                |
|-------------------|-----------------------------------------|----------------------------------------------------------------------------|
| Browser extension | [Link](packages/browser-extension-link) | Allows you to use Musubi in browser extenison                              |
| In Memory         | [Link](packages/in-memory-link)         | Simple link that allows you send messages using Musubi in the same process |
| Electron          | [Link](packages/electron-link)          | Allows you tu use Musubi in Electron apps                                  |
| Socket.io         | TBA                                     | Allows you tu use pass Musubi messages using socket.io                     |

## 
