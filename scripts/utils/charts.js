import { getState } from "../state/store.js";

let categoryChart = null;
let timelineChart = null;

export function updateCategoryChart() {
  const ctx = document.getElementById("categoryChart").getContext("2d");
  const expenses = getState().expenses;
  const categories = {};

  expenses.forEach((expense) => {
    if (categories[expense.category]) {
      categories[expense.category] += expense.amount;
    } else {
      categories[expense.category] = expense.amount;
    }
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Gastos por Categoría",
        data: Object.values(categories),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (categoryChart) {
    categoryChart.data = data;
    categoryChart.update();
  } else {
    categoryChart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Gastos por Categoría",
          },
        },
      },
    });
  }
}

export function updateTimelineChart() {
  const ctx = document.getElementById("timelineChart").getContext("2d");
  const expenses = getState().expenses;
  const timeline = {};

  expenses.forEach((expense) => {
    if (timeline[expense.date]) {
      timeline[expense.date] += expense.amount;
    } else {
      timeline[expense.date] = expense.amount;
    }
  });

  const sortedDates = Object.keys(timeline).sort();
  const data = {
    labels: sortedDates,
    datasets: [
      {
        label: "Gastos por Fecha",
        data: sortedDates.map((date) => timeline[date]),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  if (timelineChart) {
    timelineChart.data = data;
    timelineChart.update();
  } else {
    timelineChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Gastos a lo largo del tiempo",
          },
        },
      },
    });
  }
}
