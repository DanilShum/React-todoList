import React,{useState, useContext} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Context from '../context'
import classNames from 'classnames'


export default function TodoItem({title,id,checked,item,isTarget}, ){
    const {setCheckbox, deleteTodo, editTodo, focusIndex} = useContext(Context)

    return (
        <li className={classNames('todo__item', { 'todo__step' : isTarget  })}>
            <div  className={classNames('todo__tearget', { 'todo__tearget-completed' : checked  })}>
                <p
                    className={classNames('todo__content', { completed: checked  })}
                    onDoubleClick={()=> editTodo(item)}
                >{title}</p>
                <Checkbox
                    type="checkbox" 
                    checked={checked}
                    onClick={()=> setCheckbox(item)} 
                />
            </div>
            <div className="todo__edit">
                <Button 
                    className="todo__change"
                    onClick={()=> editTodo(item)}
                > edit </Button>
                <Button 
                    className="todo__delete" 
                    onClick={()=> deleteTodo(item.id)}
                >delete </Button>
            </div>   
            
        </li>
    )
}