# Generated by Django 2.1.5 on 2019-01-18 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rango', '0007_auto_20190118_1425'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todolist',
            name='open_status',
            field=models.BooleanField(default=True),
        ),
    ]
