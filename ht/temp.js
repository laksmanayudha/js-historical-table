// mapNext() {
//   let newData = { ...this.data };
//   if (!this.next) {
//       this.tableContext.relations.forEach(({ current, toNext }) => {
//           this.data[toNext] = newData[current];
//           this.syncViewData();
//       });
//   } else {
//       let nextData = this.data;
//       let prevData = this.next.data;
//       this.tableContext.relations.forEach(({ current, toNext }) => {
//           newData[current] = nextData[toNext];
//           newData[toNext] = prevData[current];
//       });
//   }
//   return newData;
// }