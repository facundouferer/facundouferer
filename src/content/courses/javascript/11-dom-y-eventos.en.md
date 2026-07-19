---
title: 'DOM and Events'
course: 'javascript'
slug: 'dom-y-eventos'
order: 11
lang: 'en'
published: true
---

# DOM and Events

The DOM (Document Object Model) is the tree of objects that represents your HTML page. JavaScript uses it to interact with what the user sees.

## Modifying the DOM

You can select elements by ID, class, or tag and change their properties:

```javascript
const titulo = document.getElementById("titulo");
titulo.innerText = "Changed by JS!";
titulo.style.color = "green";

const nuevoDiv = document.createElement("div");
document.body.appendChild(nuevoDiv);
```

## Events: The response to interaction

An event is an action that occurs in the browser (a click, a pressed key, a form submission).

### How to listen for events
The modern and recommended way is `addEventListener`:

```javascript
const boton = document.querySelector("button");
boton.addEventListener("click", (event) => {
    console.log("You clicked on:", event.target);
});
```

### Common Event Types

1. **Mouse:** `click`, `mouseover`, `mouseout`, `mousedown`, `mouseup`.
2. **Keyboard:** `keydown`, `keyup`, `keypress`.
3. **Forms:**
   - `change`: When the value changes and focus is lost.
   - `input`: While the user is typing (in real time).
   - `submit`: When submitting the form (use `event.preventDefault()` to prevent the page from reloading).

### Real-time Input Example:
```javascript
const input = document.getElementById("nombre");
input.addEventListener("input", (e) => {
    console.log("Typing:", e.target.value);
});
```
