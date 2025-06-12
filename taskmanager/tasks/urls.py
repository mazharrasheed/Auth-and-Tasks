from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet,UserSignupView,UserListView,UserProfileView,UserViewSet,current_user,user_permissions_view


router = DefaultRouter()

router.register(r'tasks', TaskViewSet,basename='task')
router.register(r'users', UserViewSet,basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('current_user/', current_user),
    path('allusers/',UserListView.as_view(),name='allusers' ),
    path('profile/',UserProfileView.as_view(),name='profile' ),
    path('signup/',UserSignupView.as_view(),name='singup' ),
    path('users/me/permissions/',user_permissions_view),
]


