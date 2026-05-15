const Filter = (props) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;

    const filterField = {
      "Название": form["structure"].value.toLowerCase(),
      "Тип": form["type"].value.toLowerCase(),
      "Страна": form["country"].value.toLowerCase(),
      "Город": form["city"].value.toLowerCase(),
      "Год": [form["yearFrom"].value, form["yearTo"].value],
      "Высота": [form["heightFrom"].value, form["heightTo"].value]
    };

    let arr = props.fullData;

    for (const key in filterField) {
      if (Array.isArray(filterField[key])) {
        const min = filterField[key][0];
        const max = filterField[key][1];

        arr = arr.filter(item => {
          if (item[key] === undefined) return false;

          const value = Number(item[key]);

          return (
            (min === "" || value >= Number(min)) &&
            (max === "" || value <= Number(max))
          );
        });
      } else {
        arr = arr.filter(item => {
          if (filterField[key] === "") return true;
          if (item[key] === undefined) return false;

          return item[key]
            .toString()
            .toLowerCase()
            .includes(filterField[key]);
        });
      }
    }

    props.filtering(arr);
  };

  const handleReset = () => {
    props.filtering(props.fullData);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <p>
        <label>Название:</label>
        <input name="structure" type="text" />
      </p>

      <p>
        <label>Тип:</label>
        <input name="type" type="text" />
      </p>

      <p>
        <label>Страна:</label>
        <input name="country" type="text" />
      </p>

      <p>
        <label>Город:</label>
        <input name="city" type="text" />
      </p>

      <p>
        <label>Год от:</label>
        <input name="yearFrom" type="number" />

        <label> до:</label>
        <input name="yearTo" type="number" />
      </p>

      <p>
        <label>Высота от:</label>
        <input name="heightFrom" type="number" />

        <label> до:</label>
        <input name="heightTo" type="number" />
      </p>

      <p>
        <button type="submit">Фильтровать</button>
        <button type="reset">Очистить фильтр</button>
      </p>
    </form>
  );
};

export default Filter;