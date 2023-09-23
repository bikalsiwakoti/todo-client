import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addTodo, updateTodo } from '../slices/todoSlice';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';
import Axios from '../config/Config';


const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, todo }) {
  const dispatch = useDispatch();
  const [todoData, setTodoData] = useState({
    name: '',
    description: '',
    date: '',
    status: 'undone',
  });

  const handleChange = (e) => {
    setTodoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (type === 'update' && todo) {
      const { _id, ...others } = todo
      setTodoData(others)
    } else {
      setTodoData({
        name: '',
        description: '',
        date: '',
        status: 'undone',
      })
    }
  }, [type, todo, modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (todoData.name === "" || todoData.description === "" || todoData.date === "") {
      toast.error('Please enter a valid details');
      return;
    }

    if (type === 'add') {
      try {
        const res = await Axios.post('/addTodo', todoData)
        console.log(res.data.data)
        toast.success('Task added successfully');
        dispatch(addTodo(res.data.data))
        setModalOpen(false);
      } catch (err) {
        toast.error('Please enter valid details');
      }
    }

    if (type === 'update') {
      try {
        const {_id, ...others} = todo
        const res = await Axios.patch(`/updateTodo/${_id}`, todoData)
        dispatch(updateTodo({id: _id, newData: todoData}));
        setModalOpen(false);
        toast.success(res.data.message);
      } catch (err) {
        toast.error('Data updated failed');
      }

    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              // animation
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === 'add' ? 'Add' : 'Update'} TODO
              </h1>
              <label htmlFor="Name">
                Name
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={todoData?.name}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="shortDescription">
                Short Description
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={todoData?.description}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="date">
                Date
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={type === "update" ? (new Date(todoData.date)).toISOString().substr(0, 10) : todoData.date}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="type">
                Status
                <select
                  id="type"
                  name="status"
                  value={todoData?.status}
                  onChange={handleChange}
                >
                  <option value="undone">Undone</option>
                  <option value="done">Done</option>
                  <option value="upcomming">Upcomming</option>
                </select>
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === 'add' ? 'Add Task' : 'Update Task'}
                </Button>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
