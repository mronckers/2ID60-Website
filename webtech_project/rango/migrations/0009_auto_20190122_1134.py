# Generated by Django 2.0.2 on 2019-01-22 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0008_auto_20190118_1431'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todolist',
            name='name',
            field=models.CharField(max_length=128),
        ),
    ]
