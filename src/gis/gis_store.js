//Testing
import { reactive } from "vue";

export const gis_store = reactive({
  test_count: 0,
  testIncrement() {
    this.test_count++;
    console.warn(`testIncrement(): test_count = ${this.test_count} `);
  },
});
