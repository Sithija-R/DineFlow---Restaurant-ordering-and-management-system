import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Search,
  ToggleLeft,
  ToggleRight,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";

import { useMenuStore } from "@/stores/menuStore";
import type { AvailabilityStatus, MenuItem } from "@/types/menu";

interface AddFormData {
  name: string;
  categoryId: string;
  price: string;
  description: string;
  imageUrl: string;
  availableCount: string;
}

export default function MenuManagement() {
  const {
    menuItems,
    categories,
    loading,
    error,
    fetchMenuItems,
    fetchCategories,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateAvailabilityStatus,
  } = useMenuStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "All">("All");

  const [formData, setFormData] = useState<AddFormData>({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    availableCount: "10",
  });

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        await Promise.all([fetchMenuItems(), fetchCategories()]);
      } catch (error) {
        console.error("Failed to load menu data:", error);

        toast.add({
          title: "Failed to load menu",
          description:
            error instanceof Error
              ? error.message
              : "Unable to load menu items or categories.",
          type: "error",
        });
      }
    };

    loadMenuData();
  }, [fetchMenuItems, fetchCategories]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.categoryId === categoryFilter;

      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, categoryFilter, searchQuery]);

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      price: "",
      description: "",
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      availableCount: "10",
    });
  };

  const handleAddSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.add({
        title: "Dish name required",
        description: "Please enter a dish name.",
        type: "warning",
      });
      return;
    }

    if (!formData.categoryId) {
      toast.add({
        title: "Category required",
        description: "Please select a category.",
        type: "warning",
      });
      return;
    }

    const price = Number(formData.price);
    const availableCount = Number(formData.availableCount);

    if (price <= 0) {
      toast.add({
        title: "Invalid price",
        description: "Price must be greater than zero.",
        type: "warning",
      });
      return;
    }

    if (availableCount < 0) {
      toast.add({
        title: "Invalid stock",
        description: "Available count cannot be negative.",
        type: "warning",
      });
      return;
    }

    try {
      await createMenuItem({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price,
        imageUrl: formData.imageUrl.trim() || undefined,
        categoryId: Number(formData.categoryId),
        availableCount,
      });

      toast.add({
        title: "Dish added",
        description: `${formData.name} has been added to the menu.`,
        type: "success",
      });

      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create menu item:", error);

      toast.add({
        title: "Failed to add dish",
        description:
          error instanceof Error
            ? error.message
            : "Unable to create the menu item.",
        type: "error",
      });
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingItem) {
      return;
    }

    if (!editingItem.name.trim()) {
      toast.add({
        title: "Dish name required",
        description: "Please enter a dish name.",
        type: "warning",
      });
      return;
    }

    try {
      await updateMenuItem(editingItem.id, {
        name: editingItem.name.trim(),
        description: editingItem.description.trim(),
        price: editingItem.price,
        imageUrl: editingItem.imageUrl,
        categoryId: editingItem.categoryId,
        availableCount: editingItem.availableCount,
      });

      toast.add({
        title: "Dish updated",
        description: `${editingItem.name} has been updated.`,
        type: "success",
      });

      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update menu item:", error);

      toast.add({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update the menu item.",
        type: "error",
      });
    }
  };

  const handleDelete = async (item: MenuItem) => {
    try {
      await deleteMenuItem(item.id);

      toast.add({
        title: "Dish deleted",
        description: `${item.name} has been removed from the menu.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete menu item:", error);

      toast.add({
        title: "Delete failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete the menu item.",
        type: "error",
      });
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const newStatus: AvailabilityStatus =
      item.status === "AVAILABLE" ? "OUT_OF_STOCK" : "AVAILABLE";

    try {
      await updateAvailabilityStatus(item.id, newStatus);

      toast.add({
        title:
          newStatus === "AVAILABLE"
            ? "Dish available"
            : "Dish marked unavailable",
        description:
          newStatus === "AVAILABLE"
            ? `${item.name} is now available.`
            : `${item.name} is now unavailable.`,
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update availability:", error);

      toast.add({
        title: "Availability update failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to update availability.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Navigation */}
        <Card className="border-slate-800 bg-slate-900/90">
          <CardContent className="p-4">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  render={<Link to="/admin/dashboard" />}
                  className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div>
                  <h1 className="text-lg font-bold text-white">
                    Menu Item Management
                  </h1>

                  <p className="text-xs text-slate-400">
                    Add, edit, or toggle availability of dishes
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 font-bold text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Dish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search + Filter */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search dish..."
              className="border-slate-800 bg-slate-900 pl-10 text-xs text-white placeholder:text-slate-500 focus-visible:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={categoryFilter === category.id ? "default" : "outline"}
                onClick={() => setCategoryFilter(category.id)}
                className={
                  categoryFilter === category.id
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="flex items-center justify-between p-4">
              <p className="text-sm text-red-400">{error}</p>

              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMenuItems()}
                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Menu Table */}
        <Card className="overflow-hidden border-slate-800 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3.5">Dish</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">In Stock Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">
                        <Skeleton className="h-12 w-64 bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <Skeleton className="h-6 w-20 bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-16 bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-12 bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <Skeleton className="h-7 w-24 bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <Skeleton className="ml-auto h-8 w-20 bg-slate-800" />
                      </td>
                    </tr>
                  ))
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Search className="mx-auto h-8 w-8 text-slate-600" />

                      <p className="mt-3 font-semibold text-slate-300">
                        No menu items found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or category filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-950/40"
                    >
                      {/* Dish */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-500">
                              <Plus className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white">
                              {item.name}
                            </h4>

                            <p className="line-clamp-1 max-w-md text-[11px] text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="border-slate-700 bg-slate-800 text-[10px] text-slate-300"
                        >
                          {item.categoryName || "Uncategorized"}
                        </Badge>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3 text-sm font-bold text-orange-400">
                        LKR {item.price.toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-300">
                          {item.availableCount}
                        </span>
                      </td>

                      {/* Availability */}
                      <td className="px-4 py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAvailability(item)}
                          disabled={loading}
                          className={
                            item.status === "AVAILABLE"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                              : "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          }
                        >
                          {item.status === "AVAILABLE" ? (
                            <>
                              <ToggleRight className="mr-1.5 h-4 w-4" />
                              Available
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="mr-1.5 h-4 w-4" />
                              Sold Out
                            </>
                          )}
                        </Button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingItem({ ...item })}
                            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(item)}
                            className="border-slate-700 bg-slate-800 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-slate-800 bg-slate-900 shadow-2xl">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">
                    Add New Dish
                  </CardTitle>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Dish Name *
                    </label>

                    <Input
                      required
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          name: event.target.value,
                        })
                      }
                      placeholder="e.g. Lobster Bisque"
                      className="border-slate-800 bg-slate-950 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Category *
                      </label>

                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            categoryId: value,
                          })
                        }
                      >
                        <SelectTrigger className="border-slate-800 bg-slate-950 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent className="bg-slate-800">
                          {" "}
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                              className="cursor-pointer bg-slate-800 text-sm text-white hover:bg-slate-700/80 hover:text-white"

                            >
                              {" "}
                              {category.name}{" "}
                            </SelectItem>
                          ))}{" "}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Price *
                      </label>

                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            price: event.target.value,
                          })
                        }
                        placeholder="18.50"
                        className="border-slate-800 bg-slate-950 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Available Count
                    </label>

                    <Input
                      type="number"
                      min="0"
                      value={formData.availableCount}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          availableCount: event.target.value,
                        })
                      }
                      className="border-slate-800 bg-slate-950 text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Description
                    </label>

                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          description: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-500"
                      placeholder="Brief ingredients and preparation details..."
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Image URL
                    </label>

                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          imageUrl: event.target.value,
                        })
                      }
                      className="border-slate-800 bg-slate-950 text-white"
                    />
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModalOpen(false)}
                      className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                    >
                      {loading && (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Dish
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-slate-800 bg-slate-900 shadow-2xl">
              <CardHeader className="border-b border-slate-800">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="truncate text-base text-white">
                    Edit Dish: {editingItem.name}
                  </CardTitle>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingItem(null)}
                    className="shrink-0 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Dish Name
                    </label>

                    <Input
                      value={editingItem.name}
                      onChange={(event) =>
                        setEditingItem({
                          ...editingItem,
                          name: event.target.value,
                        })
                      }
                      className="border-slate-800 bg-slate-950 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Price
                      </label>

                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingItem.price}
                        onChange={(event) =>
                          setEditingItem({
                            ...editingItem,
                            price: Number(event.target.value) || 0,
                          })
                        }
                        className="border-slate-800 bg-slate-950 text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Available Count
                      </label>

                      <Input
                        type="number"
                        min="0"
                        value={editingItem.availableCount}
                        onChange={(event) =>
                          setEditingItem({
                            ...editingItem,
                            availableCount: Number(event.target.value) || 0,
                          })
                        }
                        className="border-slate-800 bg-slate-950 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Description
                    </label>

                    <textarea
                      rows={3}
                      value={editingItem.description}
                      onChange={(event) =>
                        setEditingItem({
                          ...editingItem,
                          description: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-sm text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-300">
                      Image URL
                    </label>

                    <Input
                      type="url"
                      value={editingItem.imageUrl || ""}
                      onChange={(event) =>
                        setEditingItem({
                          ...editingItem,
                          imageUrl: event.target.value,
                        })
                      }
                      className="border-slate-800 bg-slate-950 text-white"
                    />
                  </div>

                  <Separator className="bg-slate-800" />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                      className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                    >
                      {loading && (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
