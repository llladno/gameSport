import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import TaskFilterComponent from '../ui/TaskFilterComponent.vue';
import { useTaskFilter } from '@features/taskFilter';
import { TaskPriority } from '@entities/task';

describe('TaskFilterComponent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mountComponent = () => {
    const wrapper = mount(TaskFilterComponent, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              taskFilterStore: {
                filterOptions: {
                  search: '',
                  showCompleted: true,
                  priorities: [TaskPriority.Low, TaskPriority.Medium, TaskPriority.High],
                },
              },
            },
          }),
        ],
      },
    });

    const taskFilterStore = useTaskFilter();
    return { wrapper, taskFilterStore };
  };

  it('should render correctly', () => {
    const { wrapper } = mountComponent();
    
    expect(wrapper.find('.task-filter').exists()).toBe(true);
    expect(wrapper.find('.task-filter__search-input').exists()).toBe(true);
    expect(wrapper.find('#show-completed').exists()).toBe(true);
    expect(wrapper.findAll('.task-filter__priority-btn')).toHaveLength(3);
    expect(wrapper.find('.task-filter__reset-btn').exists()).toBe(true);
  });

  it('should call setSearchQuery when search input changes', async () => {
    const { wrapper, taskFilterStore } = mountComponent();
    
    const searchInput = wrapper.find('.task-filter__search-input');
    await searchInput.setValue('test search');
    
    expect(taskFilterStore.setSearchQuery).toHaveBeenCalledWith('test search');
  });

  it('should call toggleCompletedVisibility when checkbox changes', async () => {
    const { wrapper, taskFilterStore } = mountComponent();
    
    const checkbox = wrapper.find('#show-completed');
    await checkbox.setValue(false);
    
    expect(taskFilterStore.toggleCompletedVisibility).toHaveBeenCalledWith(false);
  });

  it('should call togglePriorityFilter when priority button is clicked', async () => {
    const { wrapper, taskFilterStore } = mountComponent();
    
    const priorityButtons = wrapper.findAll('.task-filter__priority-btn');
    await priorityButtons[0].trigger('click');

    expect(taskFilterStore.togglePriorityFilter).toHaveBeenCalledWith(TaskPriority.Low);
  });

  it('should call resetFilters when reset button is clicked', async () => {
    const { wrapper, taskFilterStore } = mountComponent();
    
    const resetButton = wrapper.find('.task-filter__reset-btn');
    await resetButton.trigger('click');
    
    expect(taskFilterStore.resetFilters).toHaveBeenCalled();
  });

  it('should mark priority buttons as active based on selected priorities', async () => {
    const { wrapper } = mountComponent();
    
    const allActiveButtons = wrapper.findAll('.task-filter__priority-btn.active');
    expect(allActiveButtons).toHaveLength(3);
    
    const store = useTaskFilter();
    store.filterOptions.priorities = [TaskPriority.Medium, TaskPriority.High];
    await wrapper.vm.$nextTick();
    
    const updatedActiveButtons = wrapper.findAll('.task-filter__priority-btn.active');
    expect(updatedActiveButtons).toHaveLength(2);
  });
}); 