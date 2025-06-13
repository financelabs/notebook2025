import DOMPurify from 'dompurify';

const textarea = document.querySelector("textarea");
const cleantextDiv = document.getElementById("cleantext");
textarea.addEventListener("input", (event) => {
    const clean = DOMPurify.sanitize(
        event.target.value,
        {ALLOWED_TAGS: ['p', 'table', 'tr', 'td', 'th', 'ul', 'li']}
    
    );
    cleantextDiv.innerHTML = clean;
});

// var e = document.getElementsByTagName('span')[0];

// var d = document.createElement('div');
// d.innerHTML = e.innerHTML;

// e.parentNode.replaceChild(d, e);






