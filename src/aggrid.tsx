import { Component, createResource, createSignal } from 'solid-js';

import AgGridSolid, { AgGridSolidRef } from 'ag-grid-solid';
import { ApplyColumnStateParams, ColDef, ColGroupDef, CsvExportParams } from 'ag-grid-community';
import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


function assureQuotes(cell: string): string {
  let rc = cell;
  if (cell.includes('"')) {
    cell = cell.replaceAll('"', '""');
    rc = `"${cell}"`
  }
  return rc;
}

function assureQuotesInLines(csv: string): string {
  const rc = csv
    .split('\r\n')
    .map(l => l.split(',').map(c => assureQuotes(c)))
    .join('\r\n');
  return rc;
}

const fetchData = async () => (await fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')).json();

function formattedDate(date: string): string {
  const [day, month, year] = date.split('/');
  const rc = `${year}-${month}-${day}`;
  return rc;
}

interface OlympicWinner {
  athlete: string,
  age: number,
  country: string,
  year: string,
  date: string,
  sport: string,
  gold: number,
  silver: number,
  bronze: number,
  total: number
};

const aggrid: Component = () => {
  const [rowData] = createResource(fetchData, { deferStream: true });
  const [gridRef, setGridRef] = createSignal<AgGridSolidRef>(undefined);
  const [rowCount, setRowCount] = createSignal(0);

  const columnDefs: ColGroupDef<OlympicWinner>[] = [
    {
      headerName: 'Event Details',
      headerClass: 'bg-gradient-to-r from-blue-200 to-green-300',
      children: [
        // set filter is an enterprise feature
        { field: 'year', headerClass: 'bg-gradient-to-r from-blue-200 to-blue-100', filter: 'agSetColumnFilter' },
        {
          field: 'date', headerClass: 'bg-gradient-to-r from-blue-100 to-green-300',
          filter: 'agDateColumnFilter',
          filterParams: {
            comparator: (filterLocalDateAtMidnight: Date, cellValue: string): number => {
              if (cellValue === null) return 0;
              const [yearStr, monthStr, dayStr] = cellValue.split('-');
              const cellDate = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));

              if (cellDate < filterLocalDateAtMidnight) {
                return -1;
              } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
              }
              return 0;
            }
          },
          valueGetter: params => formattedDate(params.data.date)
        },
      ] as ColDef<OlympicWinner>[]
    },
    {
      headerName: 'Athlete Details',
      headerClass: 'bg-gradient-to-r from-green-300 to-green-10',
      children: [
        { field: 'athlete', headerClass: 'bg-gradient-to-r from-green-300 to-green-200', filter: 'agTextColumnFilter' },
        { field: 'age', width: 120, headerClass: 'bg-gradient-to-r from-green-200 to-green-100', filter: 'agNumberColumnFilter' },
        { field: 'country', headerClass: 'bg-gradient-to-r from-green-100 to-green-10', filter: 'agTextColumnFilter' },
      ] as ColDef<OlympicWinner>[]
    },
    {
      headerName: 'Sport Results',
      headerClass: 'bg-orange-100',
      children: [
        { field: 'sport', headerClass: 'bg-orange-100', filter: 'agTextColumnFilter' },
        { field: 'gold', headerClass: 'bg-[#FFD700]', filter: 'agNumberColumnFilter' },
        { field: 'silver', headerClass: 'bg-gray-300', filter: 'agNumberColumnFilter' },
        { field: 'bronze', headerClass: 'bg-[#8C7853]', filter: 'agNumberColumnFilter' },
        { field: 'total', headerClass: 'bg-orange-100', filter: 'agNumberColumnFilter' }
      ] as ColDef<OlympicWinner>[]
    }
  ];

  const defaultColDef: ColDef<OlympicWinner> = {
    width: 150,
    // flex: 1,
    resizable: true,
    sortable: true,
    floatingFilter: true
  };

  const onBtnUpdate = () => {
    (document.querySelector(
      '#csvResult'
    ) as any).value = assureQuotesInLines(gridRef().api.getDataAsCsv({ suppressQuotes: true, skipColumnGroupHeaders: true } as CsvExportParams));
  };

  const onClear = () => {
    gridRef().api.setFilterModel(null)
    gridRef().columnApi.applyColumnState({
      state: [
        { colId: 'year', width: 150 },
        { colId: 'athlete', width: 150 },
        { colId: 'age', width: 120 },
        { colId: 'country', width: 150 },
        { colId: 'sport', width: 150 },
        { colId: 'gold', width: 150 },
        { colId: 'silver', width: 150 },
        { colId: 'bronze', width: 150 },
        { colId: 'total', width: 150 },
      ],
      defaultState: { sort: null },
    });
  };

  const onLogState = () => {
    console.log('filter: ', gridRef().api.getFilterModel());
    console.log('state: ', gridRef().columnApi.getColumnState());
  };

  const onRestoreFromPreset1 = () => {
    const filter = {
      // set filter is an enterprise feature
      year: { type: 'set', values: ['2008', '2012'] },
      country: {
        type: 'contains',
        filter: 'united states'
      },
      age: { type: 'lessThan', filter: '30' },
      sport: { type: 'startsWith', filter: 'swim' },
    };
    gridRef().api.setFilterModel(filter);

    const presetState: ApplyColumnStateParams = {
      state: [
        { colId: 'year', sort: "asc", sortIndex: 1 },
        { colId: 'athlete', width: 200, sort: "asc", sortIndex: 2 },
        { colId: 'age', width: 100 },
        { colId: 'country', width: 200 },
        { colId: 'sport', width: 200 },
        { colId: 'gold', width: 100 },
        { colId: 'silver', width: 100 },
        { colId: 'bronze', width: 100 },
        { colId: 'total', sort: "desc", sortIndex: 0, width: 150 },
      ],
      defaultState: { sort: null }
    };
    gridRef().columnApi.applyColumnState(presetState);
  };

  const onRestoreFromPreset2 = () => {
    const filter = {
      athlete: {
        condition1: { type: 'contains', filter: 'phelps' },
        condition2: { type: 'contains', filter: 'lochte' },
        operator: "OR"
      },
      sport: { type: 'startsWith', filter: 'swim' }
    };
    gridRef().api.setFilterModel(filter);

    const presetState: ApplyColumnStateParams = {
      state: [
        { colId: 'year', sort: "desc", sortIndex: 0 },
        { colId: 'athlete', width: 200, sort: "desc", sortIndex: 2 },
        { colId: 'age', width: 100 },
        { colId: 'country', width: 200 },
        { colId: 'sport', width: 200 },
        { colId: 'gold', width: 100 },
        { colId: 'silver', width: 100 },
        { colId: 'bronze', width: 100 },
        { colId: 'total', sort: "desc", sortIndex: 1, width: 150 },
      ],
      defaultState: { sort: null }
    };
    gridRef().columnApi.applyColumnState(presetState);
  };

  return (
    <>
      <div class="ag-theme-alpine grid grid grid-cols-4 gap-2 h-[85vh]">
        <div class="col-span-3">
          <AgGridSolid
            ref={ele => setGridRef(ele)}
            onFirstDataRendered={evt => setRowCount(gridRef().api.getDisplayedRowCount())}
            onFilterChanged={evt => setRowCount(gridRef().api.getDisplayedRowCount())}
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
        <button type="button" class="ml-2 p-2 bg-indigo-100 hover:bg-indigo-300 rounded-lg" onClick={onBtnUpdate}>Export</button>
        <button type="button" class="ml-2 p-2 bg-gray-100 hover:bg-gray-300 rounded-lg" onClick={onClear}>Clear</button>
        <button type="button" class="ml-2 p-2 bg-purple-100 hover:bg-purple-300 rounded-lg" onClick={onLogState}>Log</button>
        <button type="button" class="ml-2 p-2 bg-blue-100 hover:bg-blue-300 rounded-lg" onClick={onRestoreFromPreset1}>Preset 1</button>
        <button type="button" class="ml-2 p-2 bg-green-100 hover:bg-green-300 rounded-lg" onClick={onRestoreFromPreset2}>Preset 2</button>
      </div>
    </>
  );
};

export default aggrid;
