// parallel.js

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Done Waiting!");
    }, ms);
  });
}

// Part A: Sequential

async function sequential() {
  console.time("Sequential Call");
  await wait(1000);
  await wait(1000);
  await wait(1000);
  console.timeEnd("Sequential Call");
}

// Part B: Parallel

async function parallel() {
    console.time("Parallel Call");
    await Promise.all([
        wait(1000),
        wait(1000),
        wait(1000)
    ]);
    console.timeEnd("Parallel Call");
}

// Run
sequential();
parallel();