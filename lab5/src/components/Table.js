import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import { useState } from "react";

const Table = (props) => {
  const pagination = props.pagination;
  const amountRows = Number(props.amountRows);

  const [activePage, setActivePage] = useState("1");
  const [dataTable, setDataTable] = useState(props.data);

const updateDataTable = (value) => {
  setDataTable(value);

  props.setFilteredData(value);

  setActivePage("1");
};

  const changeActive = (event) => {
    setActivePage(event.target.textContent);
  };

  const n = Math.ceil(dataTable.length / amountRows);

  const pages = Array.from({ length: n }, (v, i) => i + 1).map((item, index) =>
    <span key={index} onClick={changeActive} className={Number(activePage) === item ? "active-page" : ""}>
      {item}
    </span>
  );

  return (
    <>
      <h4>Фильтры</h4>

      <Filter filtering={updateDataTable} data={dataTable} fullData={props.data}/>

      <table>
        <TableHead head={Object.keys(props.data[0])} />

        {
          pagination
            ? <TableBody body={dataTable} amountRows={amountRows} numPage={activePage}/>
            : <TableBody body={dataTable} amountRows={dataTable.length} numPage="1"/>
        }
      </table>

      {
        pagination && dataTable.length > amountRows &&
        <div className="pagination">
          {pages}
        </div>
      }
    </>
  );
};

export default Table;