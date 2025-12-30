<template>
  <div class="datalist">
    <p>新增與編輯資料項目</p>
    <div class="row">
      <div class="col-md-12">
        <table class="table">
          <thead>
            <tr>
              <th>標題</th>
              <th>圖片</th>
              <th>銷售狀態</th>
              <th>編輯</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.img }}</td>
              <td>
                <input type="checkbox" v-model="item.onStock">
              </td>
              <td>
                <button class="btn btn-primary me-2">編輯</button>
                <button class="btn btn-danger">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const 
</script>

<style></style>