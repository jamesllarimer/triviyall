 <!-- components/SetModal.vue -->
 <template>
    <div v-if="modelValue" class="relative z-10">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div>
              <h3 class="text-lg font-medium leading-6 text-gray-900">
                {{ isEditing ? 'Edit Question Set' : 'Create New Question Set' }}
              </h3>
              
              <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Week Start Date</label>
                  <input
                    type="date"
                    v-model="form.week_start_date"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    v-model="form.status"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
  
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                  >
                    {{ isEditing ? 'Save Changes' : 'Create Set' }}
                  </button>
                  <button
                    type="button"
                    @click="$emit('update:modelValue', false)"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean
    editingSet?: any
  }>()
  
  const emit = defineEmits(['update:modelValue', 'save'])
  
  const isEditing = computed(() => !!props.editingSet)
  
  const form = ref({
    week_start_date: '',
    status: 'draft',
    is_auto_generated: false
  })
  
  watchEffect(() => {
    if (props.editingSet) {
      form.value = { ...props.editingSet }
    } else {
      form.value = {
        week_start_date: '',
        status: 'draft',
        is_auto_generated: false
      }
    }
  })
  
  const handleSubmit = () => {
    emit('save', form.value)
    emit('update:modelValue', false)
  }
  </script>