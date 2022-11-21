import { Accessor, Component, createSignal } from 'solid-js';
import { useRouteData } from '@solidjs/router';

import AgGridSolid, { AgGridSolidRef } from 'ag-grid-solid';

import { columnDefs, defaultColDef, onBtnUpdate, onClear, onLogState, onRestoreFromPreset1, onRestoreFromPreset2 } from './aggrid_helpers';

const aggrid: Component = () => {
  const rowData = useRouteData<Accessor<any>>();
  const [rowCount, setRowCount] = createSignal(0);
  const [gridRef, setGridRef] = createSignal<AgGridSolidRef>(undefined);  

  return (
    <>
      <div class="ag-theme-alpine grid grid-cols-4 gap-2 h-[85vh]">
        <div class="col-span-3">
          <AgGridSolid
            ref={ele => setGridRef(ele)}
            onFirstDataRendered={() => setRowCount(gridRef().api.getDisplayedRowCount())}
            onFilterChanged={() => setRowCount(gridRef().api.getDisplayedRowCount())}
            rowData={rowData()}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
          />
        </div>
        <textarea id="csvResult" class="mr-2 col-span-1 h-full border-2 border-black">
          Click the Export button to view exported CSV here
        </textarea>
      </div>
      <div class="m-2 h-2">
        <span class="p-2 bg-blue-700 text-white rounded-lg">{rowCount()} rows</span>
        <button type="button" class="ml-2 p-2 bg-indigo-100 hover:bg-indigo-300 rounded-lg" onClick={() => onBtnUpdate(gridRef())}>Export</button>
        <button type="button" class="ml-2 p-2 bg-gray-100 hover:bg-gray-300 rounded-lg" onClick={() => onClear(gridRef())}>Clear</button>
        <button type="button" class="ml-2 p-2 bg-purple-100 hover:bg-purple-300 rounded-lg" onClick={() => onLogState(gridRef())}>Log</button>
        <button type="button" class="ml-2 p-2 bg-blue-100 hover:bg-blue-300 rounded-lg" onClick={() => onRestoreFromPreset1(gridRef())}>Preset 1</button>
        <button type="button" class="ml-2 p-2 bg-green-100 hover:bg-green-300 rounded-lg" onClick={() => onRestoreFromPreset2(gridRef())}>Preset 2</button>
      </div>
    </>
  );
};

export default aggrid;
