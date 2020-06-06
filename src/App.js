import React, {useState, useRef,useEffect} from 'react';
import TodoItem from "./Todo/TodoItem";
import Context from "./context"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames'


function App() {
  const [listing, setListing] = useState([])
  const [listTitle, setlistTitle] = useState('')
  const [editedId, setEditedId] = useState(null)
  const searchInput = useRef();
  const [focusIndex, setFocusIndex] = useState(-1);

  
  
  useEffect(() => {
    document.addEventListener('keydown', keyFocus);
    return () => document.removeEventListener('keydown', keyFocus);
  }, [focusIndex,listing.length])

  const keyFocus = e => {
    console.log(listing.length - 1, focusIndex)
    if (e.target.id !== 'todo__input') {
      if ((e.keyCode >= 49 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105)) {
        searchInput.current.focus()
      }
  
      if (e.code === 'ArrowDown') {
        if (focusIndex === listing.length - 1) {
          setFocusIndex(0)
          window.scrollTo(0, 0)
        } else {
          setFocusIndex(focusIndex + 1)
        }
      } else if (e.code === 'ArrowUp') {
        if (focusIndex <= 0) {
          setFocusIndex(listing.length - 1)
          document.documentElement.scrollTop = document.documentElement.scrollHeight
        } else {
          setFocusIndex(focusIndex - 1)
        }
      }
      if (e.code === 'Escape') {
        setFocusIndex(-1)
      }
      if (e.code === 'Enter') {
        editTodo(listing[focusIndex])
      }
      if (e.code === 'Backspace') {
        if (listing.length > 0 && focusIndex < listing.length) {
          deleteTodo(listing[focusIndex].id)
          if (focusIndex === listing.length - 1) {
            setFocusIndex(listing.length - 2)
          }
        }
      }
      if (e.code === 'Space') {
        if (focusIndex >= 0) {
          setCheckbox(listing[focusIndex])
        }
      }
    } else {setFocusIndex(-1)}
  }
  

  function createItem () {
    if (createItem) {
      sendOut()
    }
  }
  
  function keyPressAdd (evt) {
    if (evt.key === 'Enter') {
      editedId ? saveItem() : sendOut()
    }
    if (evt.key === 'Escape') {
      editedId ? canselTodo() : searchInput.current.blur()
    }
  }
  
  function sendOut () {
    if (listTitle.trim().length > 0) {
      setListing([
        ...listing,
        {
          id: Date.now(),
          title: listTitle,
          checked: false
        }
      ])
    }
  
    setlistTitle('')
    searchInput.current.focus()
  }
  

  function deleteTodo (id) {
    setListing(listing.filter(todo => todo.id !== id))
    canselTodo()
  }
  
  function editTodo (item) {
    setEditedId(item.id)
    setlistTitle(item.title)
    searchInput.current.focus()
  }
  
  function saveItem () {
    setListing(listing.map(todo => {
      if (todo.id === editedId) {
        todo.title = listTitle
      }
      return todo
    }))
    canselTodo()
  }
  
  function setCheckbox (item) {
    setListing(listing.map(todo => {
      if (todo.id === item.id) {
        todo.checked = !todo.checked
      }
      return todo
    }))
  }

  function canselTodo(){
    setEditedId(null)
    setlistTitle('')
  }

  function declOfNum(number, titles) {  
    let cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<10)? 2 : cases[(number%10<5)?number%10:5] ];  
  }
  
  function genStatusText() {
    return (listing.length === 0) ? 'Задач нет' : (listing.length > 0 && listing.length > completedTodo.length ) ? 
      `Выполненых задач ${completedTodo.length} из ${listing.length}` :
      declOfNum( completedTodo.length, [
        `Выполнена ${completedTodo.length} задача` , 
        `Выполнено ${completedTodo.length} задачи`, 
        `Выполнены все ${completedTodo.length} задач`])
    }

  let completedTodo = listing.filter(item => item.checked)
 
  return (
    <Context.Provider value={{deleteTodo,editTodo,setCheckbox,focusIndex}}>
      <div className="wrapper"> 
        <ul className="todo__listing">
            {listing.map((item, i) => <TodoItem {...item} isTarget={i === focusIndex}  item={item}  key= {item.id} listing={listing} />)}
        </ul>
        <div className='todo__number-tasks'>
          <p>{genStatusText()}</p>          
        </div>
        <section className={classNames('todo__create', { 'todo__create-position' : true  })}>
          <TextField
            id="todo__input"
            variant="outlined"
            className="todo__input"
            autoFocus={true}
            inputRef={searchInput}
            label="Задача"
            value={listTitle}
            onChange={event => setlistTitle(event.target.value)}
            onKeyDown={keyPressAdd}
          />
          <Button 
              className= "todo__btn-create"
              onClick={() => editedId ? saveItem() : createItem()}
              type="button"
              disabled = {listTitle.trim().length === 0}
              color="primary"
          >
            {editedId !== null ? 'Изменить' : 'Добавить'}
          </Button>
          {
            editedId && <Button onKeyUp={canselTodo} onClick={canselTodo} color="secondary" type="button">Отмена</Button>
          }
        </section>

      </div>
    </Context.Provider>  
      
  );
}

export default App;
