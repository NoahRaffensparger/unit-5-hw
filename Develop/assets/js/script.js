const addTaskBtn = $('#add-task-btn')
const modalBtn = $('#modal-btn')
const taskTitle = document.querySelector('#task-title')
const dueDate = document.querySelector('#task-date')
const descrip = document.querySelector('#task-descrip')
const form = document.querySelector('#modal-form')
const cardDisplay = $('.card')


const cards = []

function readCardsFromStorage(){

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    let cards = JSON.parse(localStorage.getItem('cards'));

    if(cards) {

    for (let i = 0; i < cards.length; i++) {
    
    createTaskCard(cards[i])
    }
    }
}

function createTaskCard(card){

    const todoList = $('#todo-cards');

    const inProgressList = $('#in-progress-cards');

    const doneList = $('#done-cards');

    const taskCard = $('<div>')
        .addClass('card project-card draggable my-3')
        .attr('data-project-id', card.id)
    const cardHeader = $('<div>').addClass('card-header h4').text(card.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(card.descrip);
    const cardDueDate = $('<p>').addClass('card-text').text(card.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-project-id', card.id);
    cardDeleteBtn.on('click', handleDeleteProject);

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    if (card.dueDate && card.status !== 'done') {
        const now = dayjs();
        const taskDueDate = dayjs(card.dueDate, 'DD/MM/YYYY');
    
        if (now.isSame(taskDueDate, 'day')) {
          taskCard.addClass('bg-warning text-white');
        } else if (now.isAfter(taskDueDate)) {
          taskCard.addClass('bg-danger text-white');
          cardDeleteBtn.addClass('border-light');
        }
      }

    if (card.status === 'to-do') {
        todoList.append(taskCard);
      } else if (card.status === 'in-progress') {
        inProgressList.append(taskCard);
      } else if (card.status === 'done') {
        doneList.append(taskCard);
      }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,

        helper: function (e) {

          const original = $(e.target).hasClass('ui-draggable')
            ? $(e.target)
            : $(e.target).closest('.ui-draggable');
          return original.clone().css({
            width: original.outerWidth(),
          });
        },
    });
}
function handleDrop(event, ui) {

    let cards = JSON.parse(localStorage.getItem('cards'));

    if(cards) {
  
    const taskId = ui.draggable[0].dataset.projectId;
    
    const newStatus = event.target.id;
    
    for (let card of cards) {
      if (card.id === taskId) {
        card.status = newStatus;
      }
    }
    localStorage.setItem('cards', JSON.stringify(cards));

    readCardsFromStorage()
    }
}

function handleDeleteProject() {
    const cardId = $(this).attr('data-project-id');
    let cards = JSON.parse(localStorage.getItem('cards'));

    if(cards) {
        cards.forEach((card) => {
            if (card.id === cardId) {
              cards.splice(cards.indexOf(card), 1);
            }
          });
    localStorage.setItem('cards', JSON.stringify(cards));
    readCardsFromStorage()
    }
}      

$(document).ready(function () {

    readCardsFromStorage()

    addTaskBtn.on('click', function(e){
        e.preventDefault()
        $('.modal').modal('show');
    })

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    $('#task-date').datepicker({
        changeMonth: true,
        changeYear: true,
    });

    modalBtn.on('click', function(e){
        e.preventDefault()

        let newCard = {
        id: Math.random().toString(36).slice(2),
        title: '',
        dueDate: '',
        descrip: '',
        status: 'to-do',    
        }
        
        newCard.title = taskTitle.value
        newCard.dueDate = dueDate.value
        newCard.descrip = descrip.value
        
        cards.push(newCard)
        
        localStorage.setItem('cards', JSON.stringify(cards));

        readCardsFromStorage()
        
        form.reset()
    })
    cardDisplay.on('click', '.btn-delete-project', handleDeleteProject);
})