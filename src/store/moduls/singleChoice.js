/**
 * 编辑状态
 */
const state = {
    editState: false
}

const mutations = {
    /**
     * 开始编辑 
     * @param {Boolean} state 
     */
    startEdit(state) {
        state.editState = true
    },

    /**
     * 结束编辑
     * @param {Boolean} state 
     */
    endEdit (state) {
        state.editState = false
    }
}

export default {
    namespace: true,
    state,
    mutations
}