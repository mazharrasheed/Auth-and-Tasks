from django.db import models
from django.contrib.auth.models import User
# Create your models here.



class CustomPermissions(models.Model):
    class Meta:
        permissions = [
            ('view_dashboard', 'Can view dashboard'),
            ("view_balance_sheet", "Can view balance sheet"),
            ("view_store", "Can view store"),
            ("view_reports", "Can view reports"),
            ("view_inventory", "Can view inventory"),
            # Add more custom permissions here
        ]


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)

    filtered = SoftDeleteManager()
    objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self):
        self.is_deleted = True
        self.save()

    def hard_delete(self):
        super().delete()



class Task(SoftDeleteModel):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
    
class Project(models.Model):
    name = models.CharField(max_length=100)
    is_deleted=models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

    
class Category(SoftDeleteModel):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Unit(models.Model):
    name=models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Product(SoftDeleteModel):

    ACTIVE = 'Atcive'
    INACTIVE = 'Inactive'

    STATUS_TYPE_CHOICES = [
        (ACTIVE , 'Active'),
        (INACTIVE ,'Inactive'),
    ]

    category=models.ForeignKey(Category,on_delete=models.RESTRICT)
    productname=models.CharField(max_length=255,unique=True)
    product_size=models.CharField(max_length=255)
    # product_sale_price=models.CharField(max_length=255)
    product_quantity=models.CharField(max_length=255,null=True,blank=True )
    unit=models.CharField(max_length=255,default="Nos")
    weight=models.FloatField(max_length=255,default=0,null=True,blank=True)
    # product_status=models.CharField(max_length=50,choices=STATUS_TYPE_CHOICES)
    product_status=models.BooleanField(default=False)
    pro_img=models.ImageField(upload_to="uploaded/products/",null=True,blank=True)

    def __str__(self):
        return f"{self.productname}"
   
class Store_Issue_Request(models.Model):
    products = models.ManyToManyField(Product, through='Store_Issue_Request_Product')
    date_created = models.DateTimeField(auto_now_add=True)
    project =  models.ForeignKey(Project,on_delete=models.PROTECT,null=True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT,null=True)
    issue= models.BooleanField(default=False)

    def __str__(self):
        return f"Store Issue {self.id} - {self.date_created.strftime('%Y-%m-%d')}"

class Store_Issue_Request_Product(models.Model):
    store_issue_request = models.ForeignKey(Store_Issue_Request, on_delete=models.RESTRICT)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.productname} (Qty: {self.quantity})"

class Store_Issue_Note(models.Model):
    products = models.ManyToManyField(Product, through='Store_Issue_Product')
    date_created = models.DateTimeField(auto_now_add=True)
    project =  models.ForeignKey(Project,on_delete=models.PROTECT,null=True)
    created_by = models.ForeignKey(User, on_delete=models.RESTRICT,null=True)
    request= models.ForeignKey(Store_Issue_Request,on_delete=models.RESTRICT,null=True)

    def __str__(self):
        return f"Store Issue {self.id} - {self.date_created.strftime('%Y-%m-%d')}"

class Store_Issue_Product(models.Model):
    store_issue_note = models.ForeignKey(Store_Issue_Note, on_delete=models.RESTRICT)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.productname} (Qty: {self.quantity})"