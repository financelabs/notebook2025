import React, { useContext } from "react";
import { GlobalContext, GlobalDispatchContext } from "../../features/GlobalContext";

import PostsButtonGroup from "./PostsButtonGroup";

import { ButtonGroup, Button } from "react-bootstrap";

function IconBar() {
    const state = useContext(GlobalContext);
    const dispatch = useContext(GlobalDispatchContext);

    let { expandView, email  } = state;

    return <div className="icon-bar">
      {!!email ? (
        <PostsButtonGroup />
      ) : (
        <ButtonGroup aria-label="Posts Buttons" size="sm">
          <Button
            variant="outline-secondary"
            onClick={() => dispatch(new_empty_spreadsheet())}
            data-toggle="tooltip"
            data-placement="bottom"
            title="Новый расчет"
          >
            Нов
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => dispatch({
                type: "TOGGLE_PROPERTY"
              })}
            data-toggle="tooltip"
            data-placement="bottom"
            title={expandView ? "Свернуть расчет" : "Развернуть расчет"}
          >
            {expandView ? "Сверн" : "Разв"}
          </Button>
        </ButtonGroup>
      )}

      <ButtonGroup aria-label="Rows Buttons" size="sm">
        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Добавить строку ниже"
          onClick={() => dispatch(add_row_under())}
        >
          +_
        </Button>
        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Добавить строку выше"
          onClick={() => dispatch(add_row_before())}
        >
          +-
        </Button>
        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Удалить эту строку"
          onClick={() => dispatch(delete_row())}
        >
          x-
        </Button>
      </ButtonGroup>

      <ButtonGroup aria-label="Columns Buttons" size="sm">
        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Добавить колонку справа"
          onClick={() => dispatch(add_column_after())}
        >
          +|
        </Button>
        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Добавить колонку слева"
          onClick={() => dispatch(add_column_before())}
        >
          |+
        </Button>
        <Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Удалить эту колонку"
          onClick={() => dispatch(delete_column())}
        >
          x|
        </Button>
      </ButtonGroup>

      {!!email ? (
        <ButtonGroup aria-label="Workbook Buttons" size="sm">

<Button
          variant="outline-secondary"
          data-toggle="tooltip"
          data-placement="bottom"
          title="Рабочая тетрадь"
        >
          <a href="../myworkbook" target="_blank">
            РТ
          </a>
        </Button>

          {/* <Button
            variant="outline-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Сформировать рабочую тетрадь"
            onClick={() => navigate("/myworkbook/")}
          >
            РТ
          </Button> 
          <SaveXLSButton />
         <Button
            variant="outline-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Вставить таблицу из буфера обмена"
            onClick={() => {
              //      dispatch(load_data({ protoData: sheetclip.parse('A/tB/tC/nD/t"Some/nlong/ntext"/tF/nG/tH/tI/n') }));
              // console.log(clipboard);
              // console.log(makeArray(clipboard));
              // const IS_CLIPBOARD_API_ENABLED = (typeof navigator === 'object') && typeof navigator.clipboard === 'object' ? true : false;
              // console.log(IS_CLIPBOARD_API_ENABLED);
              // if (!!navigator.clipboard) {
              //   // Clipboard API not available
              //   console.log('Open')
              // } else { console.log('Closed') }

            }}
          >
            ЧБ
        </Button>
          <Button
            variant="outline-secondary"
            data-toggle="tooltip"
            data-placement="bottom"
            title="Скопировать таблицу в буфера обмена"
            onClick={() => {
              //setClipboard('A/tB/tC/nD/t"Some/nlong/ntext"/tF/nG/tH/tI/n'
                //                 sheetclip.stringify(data)
              //); //`Random number: ${Math.random()}`
            }}
          >
            СБ
        </Button> */}
        </ButtonGroup>
      ) : null}
    </div>
}

export default IconBar