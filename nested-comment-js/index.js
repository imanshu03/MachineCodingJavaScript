const commentSection = document.getElementById('comment-section');
const mainComment = document.getElementById('main-comment');

function generateId() {
    const str = 'ABCDEF123456';
    let id = '';
    for (let i = 0; i < 6; i++) {
        const idx = Math.floor(Math.random() * str.length);
        id += str[idx];
    }
    return id;
}

function updateLocalStorage() {
    const data = state.getState();
    localStorage.setItem('comments', JSON.stringify(data));
}

function addNewComment(parentId = null, childId = null, cmtInput = null, cmtLike = 0) {
    const id = childId || generateId();
    let div = document.createElement('div');
    div.className = "comment";
    div.id = id;
    div.dataset.id = id;
    if (parentId) {
        div.dataset.parentId = parentId;
    }

    let input = document.createElement('input');
    const text = cmtInput || mainComment.value;
    input.value = text;
    input.disabled = true;
    div.appendChild(input);

    let newComment = state.createComment(parentId, id, text, cmtLike);

    let btn = document.createElement('button');
    btn.innerText = 'Likes';
    let span = document.createElement('span');
    span.innerText = cmtLike;
    btn.appendChild(span);
    btn.onclick = function () {
        const newLikes = Number(span.innerText) + 1;
        span.innerText = newLikes;
        newComment.likes = newLikes;
        updateLocalStorage();
    }
    div.appendChild(btn);

    btn = document.createElement('button');
    btn.innerText = 'Delete';
    btn.onclick = function () {
        div.parentElement.removeChild(div);
        state.removeDataById(id);
        newComment = null;
        updateLocalStorage();
    }
    div.appendChild(btn);

    btn = document.createElement('button');
    btn.innerText = 'Reply';
    btn.onclick = inputChildComment(id);
    div.appendChild(btn);

    btn = document.createElement('button');
    btn.innerText = 'Edit';
    function editUpdate() {
        btn.innerText = 'Update';
        input.disabled = false;
        btn.onclick = function () {
            input.disabled = true;
            btn.innerText = 'Edit'
            btn.onclick = editUpdate;
            newComment.text = input.value;
            updateLocalStorage();
        }
    }
    btn.onclick = editUpdate;
    div.appendChild(btn);

    if (parentId) {
        const parent = document.getElementById(parentId);
        parent.appendChild(div);
    } else {
        commentSection.appendChild(div);
        mainComment.value = '';
    }
    updateLocalStorage();
}

function inputChildComment(id) {
    return () => {
        const parentCmt = document.getElementById(id);

        const div = document.createElement('div');
        div.className = 'child-comment-add';

        const input = document.createElement('input');
        div.appendChild(input);

        const btn = document.createElement('button');
        btn.innerText = 'Add';
        btn.onclick = createChildComment(id, input, div);
        div.appendChild(btn);

        parentCmt.appendChild(div);
    };
}

function createChildComment(parentId, input, div) {
    return () => {
        addNewComment(parentId, null, input.value);
        div.parentElement.removeChild(div);
    };
}

const state = (function () {
    function Comment(parentId, id, text, likes = 0) {
        this.parentId = parentId;
        this.id = id;
        this.text = text;
        this.likes = likes;
    }

    let state = [];

    return {
        getState() {
            return state;
        },
        getDataById(id) {
            return state.find(data => data.id === id);
        },
        createComment(parentId = null, id = null, text = "", likes = 0) {
            const data = new Comment(parentId, id, text, likes);
            state.push(data);
            return data;
        },
        removeDataById(id) {
            state = state.filter((data) => data.id !== id && data.parentId !== id);
        }
    }
})();

window.onload = function () {
    let data = localStorage.getItem('comments');
    if (data) {
        data = [...JSON.parse(data)];
        data.forEach((comment) => {
            addNewComment(comment.parentId, comment.id, comment.text, comment.likes);
        });
    }
}