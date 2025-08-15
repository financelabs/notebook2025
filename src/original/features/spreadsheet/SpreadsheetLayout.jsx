import React from "react";
//import { useSelector, useDispatch } from "react-redux";
//import useClippy from 'use-clippy';
//import SheetClip from 'sheetclip';

import CompactSpreadsheetLayout from "./CompactSpreadsheetLayout";
import FormulaBlock from "./FormulaBlock";
//import Cell from "./Cell";
//import wCompactSpreadsheetLayout from "./NewCompactSpreadsheetLayout";

//import { arrayToExcel } from "../../hooks/ArrayToExcel";

import GreenHeader from "./GreenHeader";
import ActiveCells from "./ActiveCells";
import IconBar from "./IconBar";

import useMedia from "../../hooks/useMedia";

//function makeArray(string) { return string.split("/n").map((line) => line.split("/t")); }

export default function SpreadsheetLayout(props) {

  const screenSize = useMedia(
    // Media queries
    ["(min-width: 810px)", "(min-width: 400px)", "(min-width: 100px)"],
    // Column counts (relates to above media queries by array index)
    ["large", "medium", "small"],
    // Default column count
    "large"
  );

  if (screenSize === "small") {
    return <CompactSpreadsheetLayout screenSize={screenSize} />
    //    return <SmallScreenCalculations />;
  }

  // if (screenSize === 'medium') { return <MediumCalculations /> }

  if (screenSize === "medium") {
    // if (data.length > 3) {
    //   dispatch(
    //     load_data({
    //       protoData: [[""], [""], [""], [""], [""], [""], [""], [""]],
    //     })
    //   );
    // }

    return <CompactSpreadsheetLayout screenSize={screenSize} />

    //    return <CompactSpreadsheetLayout />;
  }


  return (
    <div className="excelstyle">
      <GreenHeader />
      <IconBar {...props} />
      <FormulaBlock />
      <ActiveCells /> 
    </div>
  );
}


// function Cell(props) {
//   const data = useSelector(selectSpreadsheetData)[props.rowIndex][
//     props.columnIndex
//   ];
//   const proDataValue = useSelector(selectSpreadsheetProtoData)[props.rowIndex][
//     props.columnIndex
//   ];

//   const dispatch = useDispatch();
//   const [value, setValue] = useState(data);

//   useEffect(() => {
//     setValue(data);
//   }, [data]);

//   function onKeyPressOnInput(e) {
//     if (e.key === "Enter") {
//       let valueChecked = isNaN(value) ? (!!value ? value : "") : +value;
//       dispatch(
//         update_data({
//           rowIndex: props.rowIndex,
//           columnIndex: props.columnIndex,
//           value: valueChecked,
//         })
//       );
//       dispatch(
//         update_formula({
//           rowIndex: props.rowIndex,
//           columnIndex: props.columnIndex,
//           value: !!value ? value : "",
//         })
//       );
//     }
//   }

//   function clicked() {
//     dispatch(
//       update_formula({
//         rowIndex: props.rowIndex,
//         columnIndex: props.columnIndex,
//         value: proDataValue,
//       })
//     );
//   }

//   return (
//     <input
//       type="text"
//       className={props.active ? "cells__input__active" : "cells__input"}
//       value={value}
//       onChange={(e) => setValue(e.target.value)}
//       onClick={() => clicked()}
//       onKeyPress={(e) => onKeyPressOnInput(e)}
//     />
//   );
// }

// function FormulaBlock() {
//   const formulaValue = useSelector(selectSpreadsheetFormulaValue);
//   const formulaRowIndex = useSelector(selectSpreadsheetFormulaRowIndex);
//   const formulaColumnIndex = useSelector(selectSpreadsheetFormulaColumnIndex);

//   const [formula, setFormula] = useState("");

//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     setFormula(formulaValue);
//   }, [formulaValue]);

//   function onKeyPressOnInput(e) {
//     if (e.key === "Enter") {
//       handleSubmit();
//     }
//   }

//   function handleSubmit() {
//     let valueChecked = isNaN(formula)
//       ? !!formula
//         ? formula.trim()
//         : ""
//       : +formula;
//     dispatch(
//       update_data({
//         rowIndex: formulaRowIndex,
//         columnIndex: formulaColumnIndex,
//         value: valueChecked,
//       })
//     );
//     //   setFormula("");
//   }

//   return (
//     <div className="cell-content">
//       <div>fx</div>
//       <Button
//         onClick={() => handleSubmit()}
//         variant="outline-secondary"
//         size="sm"
//       >
//         <span>&#10003;</span>
//       </Button>
//       {/* <button onClick={() => handleSubmit()}> <span >&#10003;</span></button> */}

//       <div>
//         <input
//           style={{
//             width: "100%",
//             border: "none",
//             outline: "none",
//             marginLeft: "3px",
//             fontSize: "1.2rem",
//           }}
//           value={formula === "" ? formulaValue : formula}
//           onChange={(e) => setFormula(e.target.value)}
//           onKeyPress={(e) => onKeyPressOnInput(e)}
//         />
//       </div>
//     </div>
//   );
// }


// function SmallScreenCalculations() {
//   const { register, handleSubmit } = useForm();
//   const userProfile = useSelector(selectApplication);
//   const [result, setResult] = useState(null);

//   const onSubmit = (data) => setResult(createNewDraft([[data.formula]])[0][0]);

//   return (
//     <div>
//       <div className="excelstyle">
//         <div
//           className="title"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: ".4rem",
//           }}
//         >
//           {userProfile?.avatarUrl && userProfile.avatarUrl.length > 10 ? (
//             <img
//               src={userProfile.avatarUrl}
//               alt=""
//               style={{
//                 verticalAlign: "middle",
//                 width: "30px",
//                 height: "30px",
//                 borderRadius: "50%",
//                 filter: "grayscale(100%)",
//                 objectFit: "cover",
//               }}
//             />
//           ) : null}
//           <LoginLogout />
//         </div>
//       </div>

//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Form.Group controlId="formBasicEmail">
//           <Form.Label className="small text-muted">
//             Калькулятор с поддержкой XLS формул
//           </Form.Label>
//           <Form.Control
//      //       name="formula"
//             type="textarea"
//             rows="3"
//             {...register("formula")}
//          //   ref={register}
//           />
//           <Form.Text className="text-muted">
//             Пример: =NPV(0.1;100,200,300)-500
//           </Form.Text>
//         </Form.Group>
//         <Button
//           onClick={() => handleSubmit()}
//           variant="outline-secondary"
//           size="sm"
//           block
//           type="submit"
//         >
//           <span>fx &#10003;</span>
//         </Button>
//         {!!result && (
//           <Alert variant={"success"} className="mt-2">
//             Результат калькулятора: {result}
//           </Alert>
//         )}
//       </Form>
//     </div>
//   );
// }

// function SaveXLSButton() {
//   const data = useSelector(selectSpreadsheetData);
//   const title = useSelector(selectSpreadsheetTitle);
//   const [showDownloadModal, setShowDownloadModal] = useState(false);

//   const handleClose = () => setShowDownloadModal(false);
//   const handleShow = () => setShowDownloadModal(true);

//   const apiArrayToExcel = () => {
//     arrayToExcel.convertArrayToTable(data, title);
//   };

//   return (
//     <>
//       <Button
//         variant="outline-secondary"
//         data-toggle="tooltip"
//         data-placement="bottom"
//         title="Сохранить XLS"
//         onClick={() => handleShow(true)}
//       >
//         XLS
//       </Button>
//       <Modal show={showDownloadModal} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>{title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Скачать как файл XLS</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Закрыть
//           </Button>
//           <Button variant="primary" onClick={() => apiArrayToExcel()}>
//             Скачать
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }