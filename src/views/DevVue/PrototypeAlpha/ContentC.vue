<template>
  <div>
    <h1 class="mb-5">資料圖表</h1>
    <div class="row">
      <!-- vue-chartjs 範例 -->
      <div class="col-md-6">
        <div class="chart mb-5">
          <h3>📊 vue-chartjs - 長條圖</h3>
          <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
        </div>
      </div>

      <!-- 原生 Chart.js 範例 1: 折線圖 -->
      <div class="col-md-6">
        <div class="chart mb-5">
          <h3>📈 Chart.js - 折線圖</h3>
          <canvas ref="lineChart"></canvas>
        </div>
      </div>

      <!-- 原生 Chart.js 範例 2: 圓餅圖 -->
      <div class="col-md-6">
        <div class="chart mb-5">
          <h3>🍰 Chart.js - 圓餅圖</h3>
          <canvas ref="pieChart"></canvas>
        </div>
      </div>

      <!-- 原生 Chart.js 範例 3: 甜甜圈圖 -->
      <div class="col-md-6">
        <div class="chart mb-5">
          <h3>🍩 Chart.js - 甜甜圈圖</h3>
          <canvas ref="doughnutChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 引用 vue-chartjs 與 Chart.js 所需模組
import { Bar } from 'vue-chartjs'
import Chart from 'chart.js/auto'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement } from 'chart.js'

// // 註冊 Chart.js 組件（包含折線圖、圓餅圖需要的元素）
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement, ArcElement)

// vue-chartjs 資料
const chartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: '#42b983',
      data: [40, 20, 12, 39, 10, 40]
    }
  ]
}

// 定義 Chart.js 選項
const chartOptions = {
  responsive: true, // 使圖表響應式
  maintainAspectRatio: true, // 維持長寬比
  plugins: { // 擴充元件設定
    legend: { // 圖例設定
      display: true, // 顯示圖例
    },
    title: { // 標題設定
      display: true, // 顯示標題
      text: 'Monthly Sales' // 標題文字
    }
  }
}

// 綁定 Chart.js canvas 元素
const lineChart = ref(null) // 折線圖
const pieChart = ref(null) // 圓餅圖
const doughnutChart = ref(null) // 甜甜圈圖

// 初始化原生 Chart.js
onMounted(() => {
  // 1. 折線圖
  if (lineChart.value) { // 確保 canvas 元素已綁定
    new Chart(lineChart.value, { // 建立新的 Chart 實例
      type: 'line', // 圖表類型
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: '本週訪客數', // 標籤
          data: [150, 230, 180, 320, 290, 410, 380],
          borderColor: 'rgb(75, 192, 192)', // 線條顏色
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // 線條區域顏色
          tension: 0.4, // 曲線平滑度
          fill: true
        }]
      },
      options: {
        responsive: true, // 響應性
        plugins: {
          legend: {
            display: true, // 顯示圖例
          },
          title: {
            display: true, // 顯示標題
            text: '每日訪客趨勢' // 標題文字
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  // 2. 圓餅圖
  if (pieChart.value) { // 確保 canvas 元素已綁定
    new Chart(pieChart.value, { // 建立新的 Chart 實例
      type: 'pie',
      data: {
        labels: ['電子產品', '服飾', '食品', '書籍', '家電'],
        datasets: [{
          label: '銷售佔比',
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right', // 圖例位置
          },
          title: {
            display: true,
            text: '產品類別銷售比例'
          }
        }
      }
    })
  }

  // 3. 甜甜圈圖
  if (doughnutChart.value) {
    new Chart(doughnutChart.value, {
      type: 'doughnut',
      data: {
        labels: ['已完成', '處理中', '待出貨', '已取消'],
        datasets: [{
          label: '訂單狀態',
          data: [120, 45, 30, 15],
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: '訂單狀態分布圖'
          }
        }
      }
    })
  }
})
</script>

<style lang="scss" scoped>
h3 {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #666;
}

.chart {
  background: #eee;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  canvas {
    max-height: 400px;
  }
}
</style>