---
title: 'Introduction to JavaScript'
course: 'javascript'
slug: 'introduccion'
order: 1
lang: 'en'
published: true
---

# What is JavaScript?

JavaScript is the interpreted programming language that brings the web to life. Unlike HTML (structure) and CSS (design), JavaScript allows pages to be interactive and dynamic.

## A Bit of History
It was born in 1995, created by Brendan Eich in just 10 days. Although it started as a "toy" for small tricks, today it's one of the most powerful and versatile languages in the world.

## What Does "Client-Side" Mean?
When we say JS runs on the client, it means it executes directly in the visitor's browser. This allows:
- Modifying the page in real time
- Validating forms instantly
- Creating visual effects and animations
- Communicating with servers without reloading the page

## What About "Server-Side"?
Thanks to environments like **Node.js**, JavaScript can also be used to build the "brain" of applications that handle databases and files.

## Displaying or Retrieving Data

There are several ways to interact with the user:

1. **`console.log()`**: Shows messages in the browser console (F12)
2. **`alert()`**: Shows a pop-up notification
3. **`prompt()`**: Opens a dialog for user input
4. **`document.write()`**: Writes content directly into the HTML body (use with caution)

### Example:
```javascript
const name = prompt("What's your name?");
console.log("Hello, " + name);
alert("Welcome to Programierds");
```
