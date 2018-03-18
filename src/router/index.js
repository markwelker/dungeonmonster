import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Player from '@/components/Player'
import Spells from '@/components/Spells'
import DungeonMaster from '@/components/DM'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/player',
      name: 'Player',
      component: Player
    },
    {
      path: '/spells',
      name: 'Spells',
      component: Spells
    },
    {
      path: '/dm',
      name: 'DM',
      component: DungeonMaster
    }
  ]
})
