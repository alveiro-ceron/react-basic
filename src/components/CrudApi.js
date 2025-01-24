import React, { useEffect, useState } from "react";
import CrudForm from "./CrudForm";
import CrudTable from "./CrudTable";
import { helpHttp } from "../helpers/helpHttp";
import Loader from "./Loader";
import Message from "./Message";
import ModalPortal from "./ModalPortal";
import { useModal } from "../hooks/useModal";

const CrudApi = () => {
  const [db, setDb] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [isOpenPortal, openModalPortal, closeModalPortal] = useModal(false);

  let api = helpHttp();
  let url = "http://localhost:5000/users";

  useEffect(() => {
    setLoading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        setDb(res);
        setError(null);
      } else {
        setDb(null);
        setError(res);
      }

      setLoading(false);
    });
  }, [url]);

  const createData = (data) => {
    data.id = Date.now().toString();

    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.post(url, options).then((res) => {
      if (!res.err) {
        setDb([...db, res]);
      } else {
        setError(res);
      }
    });
  };

  const updateData = (data) => {
    let endpoint = `${url}/${data.id}`;

    let options = {
      body: data,
      headers: { "content-type": "application/json" },
    };

    api.put(endpoint, options).then((res) => {
      if (!res.err) {
        let newData = db.map((el) => (el.id === data.id ? data : el));
        console.log(newData);
        setDb(newData);
      } else {
        setError(res);
      }
    });
  };

  const deleteData = (id) => {
    openModalPortal();
    setDeleteId(id);
  };

  const confirmDelete = () => {
    let endpoint = `${url}/${deleteId}`;
    let options = {
      headers: { "content-type": "application/json" },
    };

    api.del(endpoint, options).then((res) => {
      if (!res.err) {
        let newData = db.filter((el) => el.id !== deleteId);
        setDb(newData);
      } else {
        setError(res);
      }
    });

    closeModalPortal();
    setDeleteId(null);
  };


  return (
    <div>
      <h2>CRUD User Operations</h2>
      <article className="grid-1-2">
        <CrudForm
          createData={createData}
          updateData={updateData}
          dataToEdit={dataToEdit}
          setDataToEdit={setDataToEdit}
        />
        {loading && <Loader />}
        {error && (
          <Message
            msg={`Error ${error.status}: ${error.statusText}`}
            bgColor="#dc3545"
          />
        )}
        {db && (
          <CrudTable
            data={db}
            setDataToEdit={setDataToEdit}
            deleteData={deleteData}
          />
        )}
      </article>
      <ModalPortal isOpen={isOpenPortal} closeModal={closeModalPortal}>
        <h2>Modal Portal</h2>
        <h3>Are you sure you want to delete the record with id '{deleteId}'?</h3>
        <button onClick={confirmDelete}>Yes</button>
        <button onClick={closeModalPortal}>No</button>
      </ModalPortal>
    </div>
  );
};

export default CrudApi;
