import { AgGridSolidRef } from "ag-grid-solid";
import { ApplyColumnStateParams, ColDef, ColGroupDef, CsvExportParams } from "ag-grid-community";
import 'ag-grid-enterprise';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { assureQuotesInLines } from "./csv";
import { OlympicWinner } from "./olymicwinners";


export function formattedDate(date: string): string {
    const [day, month, year] = date.split('/');
    const rc = `${year}-${month}-${day}`;
    return rc;
}

export const columnDefs: ColGroupDef<OlympicWinner>[] = [
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

export const defaultColDef: ColDef<OlympicWinner> = {
    width: 150,
    resizable: true,
    sortable: true,
    floatingFilter: true
};

export const onBtnUpdate = (gridRef: AgGridSolidRef): void => {
    (document.querySelector(
        '#csvResult'
    ) as any).value = assureQuotesInLines(
        gridRef.api.getDataAsCsv({
            suppressQuotes: true,
            skipColumnGroupHeaders: true
        } as CsvExportParams)
    );
};

export const onClear = (gridRef: AgGridSolidRef): void => {
    (document.querySelector('#csvResult') as any).value = '';
    gridRef.api.setFilterModel(null);
    gridRef.columnApi.applyColumnState({
        state: [
            { colId: 'year' },
            { colId: 'date' },
            { colId: 'athlete' },
            { colId: 'age', width: 120 },
            { colId: 'country' },
            { colId: 'sport' },
            { colId: 'gold' },
            { colId: 'silver' },
            { colId: 'bronze' },
            { colId: 'total' },
        ],
        defaultState: { sort: null, width: 150 },
    });
};

export const onLogState = (gridRef: AgGridSolidRef): void => {
    console.log('filter: ', gridRef.api.getFilterModel());
    console.log('state: ', gridRef.columnApi.getColumnState());
};

export const onRestoreFromPreset1 = (gridRef: AgGridSolidRef):void => {
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
    gridRef.api.setFilterModel(filter);

    const presetState: ApplyColumnStateParams = {
        state: [
            { colId: 'year', sort: "asc", sortIndex: 1 },
            { colId: 'date', width: 180 },
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
    gridRef.columnApi.applyColumnState(presetState);
};

export const onRestoreFromPreset2 = (gridRef: AgGridSolidRef):void => {
    const filter = {
        athlete: {
            condition1: { type: 'contains', filter: 'phelps' },
            condition2: { type: 'contains', filter: 'lochte' },
            operator: "OR"
        },
        sport: { type: 'startsWith', filter: 'swim' }
    };
    gridRef.api.setFilterModel(filter);

    const presetState: ApplyColumnStateParams = {
        state: [
            { colId: 'year', sort: "desc", sortIndex: 0 },
            { colId: 'date', width: 170 },
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
    gridRef.columnApi.applyColumnState(presetState);
};
