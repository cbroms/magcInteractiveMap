# Generated by Django 2.0.4 on 2018-07-10 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mapApplication', '0009_auto_20180709_1741'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='id',
            field=models.SlugField(primary_key=True, serialize=False, unique=True),
        ),
    ]
