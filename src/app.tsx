import { Component, createMemo, lazy } from 'solid-js';
import { A, Routes, Route } from "@solidjs/router"
import { OlympicWinnersData } from './olymicwinners';

const AgGrid = lazy(() => import("./aggrid"));
const AgGrid2 = lazy(() => import("./aggrid2"));

const App: Component = () => {
  const rowData = createMemo(OlympicWinnersData);

  return (
    <>
      <div class="p-4 bg-blue-700 text-white">
        <h1 class="inline-block text-2xl font-bold"><A class="p-2" href="/">explore-aggrid-solid-tw</A></h1>
        <nav class="inline-block">
          <A class="p-2" inactiveClass="hover:ring-2 hover:ring-green-300 hover:rounded-lg" activeClass="ring-2 ring-green-700 rounded-lg" href="/first">1st Example</A>
          <A class="p-2" inactiveClass="hover:ring-2 hover:ring-green-300 hover:rounded-lg" activeClass="ring-2 ring-green-700 rounded-lg" href="/second">2nd Example</A>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<div class="m-8"><p class="font-semibold">explore-aggrid-solid-tw - 0.0.1</p><p>This site was made with Solid</p></div>} />
        <Route path="/first" component={AgGrid} data={rowData} />
        <Route path="/second" component={AgGrid2} data={rowData} />
      </Routes>
    </>
  );
};

export default App;
